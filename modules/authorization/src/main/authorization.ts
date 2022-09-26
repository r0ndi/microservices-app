import { Db } from 'mongodb'
import { MQ } from 'shared-npm'
import {
    CustomerCreatedEvent,
    RegisterEvent,
    AuthorizationEventResponse,
    LoginEvent,
    EventResponse,
} from './types/events'
import { AuthorizationValidator } from './validations/authorization-validator'
import { Customer } from './types/db'
import * as bcryptjs from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { LoginError } from './types/locals'

export default async function Authorization(mq: MQ, db: Db, passwordSalt: number, tokenSecret: string) {
    const customersCollection = db.collection<Customer>('customers')

    await mq.bind('command.authorization.register', commandAuthorizationRegister)
    await mq.bind('command.authorization.login', commandAuthorizationLogin)
    await mq.bind('event.customer.create.success', eventCustomerCreateSuccess)

    async function commandAuthorizationRegister(event: RegisterEvent, trace: string[]): Promise<EventResponse> {
        const validationResult = await AuthorizationValidator.registerEvent(customersCollection, event)
        if (validationResult.length) {
            await mq.publish('event.authorization.register.error', { error: validationResult[0].error }, trace)
            return { success: false }
        }

        const hashedPassword = await bcryptjs.hash(event.password, passwordSalt)
        const createStatus = await mq.publish('command.customer.create', { ...event, password: hashedPassword })

        return { success: createStatus }
    }

    async function commandAuthorizationLogin(event: LoginEvent, trace: string[]): Promise<AuthorizationEventResponse> {
        const validationResult = AuthorizationValidator.loginEvent(event)
        if (validationResult.length) {
            await mq.publish('event.authorization.login.error', { error: validationResult[0].error }, trace)
            return { success: false }
        }

        const customer = await customersCollection.findOne<Customer>({ email: event.email })
        if (!customer) {
            await mq.publish('event.authorization.login.error', { error: LoginError.WRONG_CREDENTIALS }, trace)
            return { success: false }
        }

        const isMatchedPassword = await bcryptjs.compare(event.password, customer.password ?? '')
        if (!isMatchedPassword) {
            await mq.publish('event.authorization.login.error', { error: LoginError.WRONG_CREDENTIALS }, trace)
            return { success: false }
        }

        await mq.publish('event.authorization.login.success', { customerId: customer.id })
        const token = jwt.sign({ id: customer.id }, tokenSecret, { expiresIn: 60 * 60 * 24 })
        return { success: true, token }
    }

    async function eventCustomerCreateSuccess(event: CustomerCreatedEvent): Promise<void> {
        await customersCollection.insertOne({ id: event.id, email: event.email, password: event.password })
    }
}
