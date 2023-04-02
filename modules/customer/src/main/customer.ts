import { Customer } from './types/db'
import { CustomerQuery, CustomerRegisterEvent } from './types/events'
import { CustomerService } from './services/customer-service'
import { Db } from 'mongodb'
import { CustomerError } from './types/locals'
import { MQ } from 'shared-npm'

export default async function Customer(mq: MQ, db: Db) {
    const customerService = CustomerService()
    const customersCollection = db.collection<Customer>('customers')

    await customersCollection.createIndex({ id: 1 })
    await customersCollection.createIndex({ id: 1, email: 1 })

    await mq.bind('event.api-gateway.register.success', eventCustomerRegistered)
    await mq.bind('query.customer.search', queryCustomerSearch)

    async function eventCustomerRegistered(event: CustomerRegisterEvent, trace: string[]): Promise<void> {
        const customer = customerService.prepareCustomer(event)
        const result = await customersCollection.insertOne(customer)

        if (!result.acknowledged) {
            return mq.publish('event.customer.create.error', { error: CustomerError.INSERT }, trace)
        }

        return mq.publish('event.customer.create.success', { ...customer }, trace)
    }

    async function queryCustomerSearch(event: CustomerQuery): Promise<Customer | null> {
        const { customer_id, ...query } = event
        return customersCollection.findOne({ _id: customer_id, ...query })
    }
}
