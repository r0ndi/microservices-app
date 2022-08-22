import { RabbitMQ } from 'shared-npm'

export default async function TestClient(mq: RabbitMQ.MQ) {
    await mq.bind('event.test-client.test', eventTest)
    await mq.bind('query.test-client.test', queryTest)
    await mq.bind('command.test-client.test', commandTest)

    async function eventTest(event: any): Promise<void> {
        console.log('eventTest', event)
    }

    async function commandTest(event: any): Promise<boolean> {
        console.log('commandTest', event)
        return true
    }

    async function queryTest(event: any) {
        return { firstname: 'Jony Bravo', lastname: 'Star', age: 15 }
    }
}
