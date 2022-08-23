import { CustomerCreateEvent } from '../types/events'
import { Customer } from '../types/db'
import { UUID } from 'shared-npm'
import * as moment from 'moment'

export function CustomerService() {
    return {
        prepareCustomer,
    }

    function prepareCustomer(eventData: CustomerCreateEvent): Customer {
        return {
            id: UUID.generate(),
            email: eventData.email,
            firstname: eventData.firstname,
            lastname: eventData.lastname,
            dateCreated: moment().toISOString(),
        }
    }
}
