import { CustomerRegisterEvent } from '../types/events'
import { Customer } from '../types/db'
import * as moment from 'moment'

export function CustomerService() {
    return {
        prepareCustomer,
    }

    function prepareCustomer(eventData: CustomerRegisterEvent): Customer {
        return { ...eventData, dateCreated: moment().toISOString() }
    }
}
