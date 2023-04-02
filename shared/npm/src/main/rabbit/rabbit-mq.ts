import { Connection, Channel, connect, Options, ConsumeMessage } from 'amqplib'
import { UUID } from '../utils/uuid'

export interface MQInterface {
    connect: () => Promise<any>
    publish: <T>(route: string, payload: Payload, trace: string[]) => Promise<T>
    bind: (route: string, callback: CallbackFn) => Promise<void>
}

export type Payload = {
    [key: string]: unknown
}

export type MQMessage = {
    trace: string[]
    payload: any
    correlationId?: string
}

export type CallbackFn = (event: any, trace: string[]) => unknown

export class MQ implements MQInterface {
    private readonly options: Options.Connect
    private readonly timeout: number = 6000
    private readonly type: string = 'topic'
    private readonly exchange: string = 'app.topic'
    private readonly reply: string = 'topic.reply-to'
    private readonly moduleName: string

    private responseListeners = {}
    private connection!: Connection
    private channel!: Channel

    public constructor(moduleName: string, options?: Options.Connect) {
        this.moduleName = moduleName
        this.options = {
            hostname: 'rabbitmq',
            port: 5672,
            ...options
        }
    }

    public connect = async (): Promise<void> => {
        try {
            this.connection = await connect(this.options)
            this.channel = await this.connection.createChannel()
            await this.channel.assertExchange(this.exchange, this.type, { durable: false })

            const { queue } = await this.channel.assertQueue(this.moduleName, { exclusive: false })
            await this.channel.bindQueue(queue, this.exchange, this.reply)
            await this.channel.consume(queue, async (message: ConsumeMessage) => {
                const response = this.encodeMessage(message.content)
                if (response.correlationId && this.responseListeners[response.correlationId]) {
                    this.responseListeners[response.correlationId]?.(response.payload)
                }
            }, { noAck: true })

            console.log(`RabbitMQ connected on ${this.options.hostname}:${this.options.port}`)
        } catch (error) {
            throw new Error(`RabbitMQ connection error: ${error.message}`)
        }
    }

    public publish = async <T>(route: string, payload: Payload = {}, trace: string[] = []): Promise<T> => {
        console.log(`Publishing message on ${route}: ${JSON.stringify(payload)}`)
        const queueMessage = {
            trace: [...trace, UUID.generate()],
            payload,
        }

        if (this.isSubscribable(route)) {
            return await this.publishWithResponse(route, queueMessage) as unknown as T
        }

        return this.channel.publish(this.exchange, route, this.decodeMessage(queueMessage)) as unknown as T
    }

    public bind = async (route: string, callback: CallbackFn): Promise<void> => {
        const { queue } = await this.channel.assertQueue(this.getQueueName(route), { exclusive: this.isSubscribable(route) })
        await this.channel.bindQueue(queue, this.exchange, route)
        console.log(`MQ: binding queue ${route}`)

        await this.channel.consume(queue, async (message: ConsumeMessage) => {
            const response = this.encodeMessage(message.content)
            console.log(`Received message on ${route}: ${JSON.stringify(response.payload)}`)

            if (response.correlationId) {
                const payload = await callback(response.payload, response.trace)
                this.channel.publish(this.exchange, this.reply, this.decodeMessage({
                    payload, correlationId: response.correlationId
                }))
            } else {
                callback(response.payload, response.trace)
            }
        }, { noAck: true })
    }

    private publishWithResponse = async (route: string, payload: MQMessage): Promise<unknown> => {
        const correlationId = UUID.generate()
        this.channel.publish(this.exchange, route, this.decodeMessage({ ...payload, correlationId }))

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                delete this.responseListeners[correlationId]
                reject(new Error(`Timeout: ${route}`))
            }, this.timeout)

            this.responseListeners[correlationId] = (response: any) => {
                console.log(`Response message on ${route}: ${JSON.stringify(response)}`)
                delete this.responseListeners[correlationId]
                clearTimeout(timeout)

                resolve(response)
            }
        })
    }

    private encodeMessage = (message: any): MQMessage => {
        return JSON.parse(Buffer.from(message).toString()) as MQMessage
    }

    private decodeMessage = (message: any): any => {
        return Buffer.from(JSON.stringify((message)))
    }

    private isSubscribable = (route: string): boolean => {
        return route.startsWith('query.')
    }

    private getQueueName = (route: string): string => {
        const prefix = (_route: string) => {
            return route.startsWith('query.') ? ':queries'
                : route.startsWith('event.') ? ':events'
                    : route.startsWith('command.') ? ':commands'
                        : ''
        }

        return this.moduleName + prefix(route)
    }
}
