import { Customer } from './types/db'
import { CustomerCreateEvent } from './types/events'
import { CustomerService } from './services/customer-service'
import { CustomerValidator } from './validations/customer-validator'
import { Db } from 'mongodb'
import { CustomerError } from './types/locals'
import { MQ } from 'shared-npm'

export default async function Customer(mq: MQ, db: Db) {
    const customerService = CustomerService()
    const customersCollection = db.collection<Customer>('customers')

    await customersCollection.createIndex({ id: 1 })

    await mq.bind('command.customer.create', commandCustomerCreate)
    await mq.bind('query.customer.search', queryCustomerSearch)

    async function commandCustomerCreate(event: CustomerCreateEvent, trace: string[]): Promise<boolean> {
        const validationResult = await CustomerValidator.customerCreateEvent(customersCollection, event)
        if (validationResult.length > 0) {
            await mq.publish('event.customer.create.error', { error: validationResult[0].error }, trace)
            return false
        }

        const customer = customerService.prepareCustomer(event)
        const result = await customersCollection.insertOne(customer)

        if (!result.acknowledged) {
            await mq.publish('event.customer.create.error', { error: CustomerError.INSERT }, trace)
            return false
        }

        await mq.publish('event.customer.create.success', { ...customer, password: event.password }, trace)
        return true
    }

    async function queryCustomerSearch(event: Partial<CustomerCreateEvent>): Promise<Customer[]> {
        return customersCollection.find({ ...event }).toArray()
    }
}
