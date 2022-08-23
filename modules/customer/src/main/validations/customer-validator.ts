import * as R from 'ramda'
import { CustomerCreateEvent } from '../types/events'
import { ValidationResult } from '../types/locals'
import { Collection } from 'mongodb'
import { Customer } from '../types/db'
import { CustomerError } from '../types/locals'

export const CustomerValidator = {
    customerCreateEvent: async (customerCollection: Collection<Customer>, event: CustomerCreateEvent): Promise<ValidationResult[]> => {
        return [
            { validation: R.isEmpty(event.firstname), error: CustomerError.EMPTY_FIRSTNAME },
            { validation: R.isEmpty(event.lastname), error: CustomerError.EMPTY_LASTNAME },
            { validation: R.isEmpty(event.email), error: CustomerError.EMPTY_EMAIL },
            { validation: !CustomerValidator.validateEmail(event.email), error: CustomerError.INVALID_EMAIL },
            { validation: !!await customerCollection.findOne({ email: event.email }), error: CustomerError.DEDUPLICATION },
        ].filter(validator => validator.validation)
    },
    validateEmail: (email: string): boolean => {
        return /\S+@\S+\.\S+/.test(email)
    }
}
