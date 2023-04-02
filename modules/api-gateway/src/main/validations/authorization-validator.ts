import * as R from 'ramda'
import { LoginEvent, RegisterEvent } from '../types/events'
import { Collection } from 'mongodb'
import { Customer } from '../types/db'
import { RegisterError, LoginError, ValidationResult } from '../types/local'

export const AuthorizationValidator = {
    registerEvent: async (customersCollection: Collection<Customer>, event: RegisterEvent): Promise<ValidationResult[]> => {
        return [
            { validation: R.isEmpty(event.firstname), error: RegisterError.EMPTY_FIRSTNAME },
            { validation: R.isEmpty(event.lastname), error: RegisterError.EMPTY_LASTNAME },
            { validation: R.isEmpty(event.password), error: RegisterError.EMPTY_PASSWORD },
            { validation: R.isEmpty(event.email), error: RegisterError.EMPTY_EMAIL },
            { validation: !AuthorizationValidator.validateEmail(event.email), error: RegisterError.INVALID_EMAIL },
            { validation: !!await customersCollection.findOne({ email: event.email }), error: RegisterError.DEDUPLICATION },
        ].filter(validator => validator.validation)
    },
    loginEvent: (event: LoginEvent): ValidationResult[] => {
        return [
            { validation: R.isEmpty(event.email), error: LoginError.EMPTY_EMAIL },
            { validation: R.isEmpty(event.password), error: LoginError.EMPTY_PASSWORD },
            { validation: !AuthorizationValidator.validateEmail(event.email), error: LoginError.INVALID_EMAIL },
        ].filter(validator => validator.validation)
    },
    validateEmail: (email: string): boolean => {
        return /\S+@\S+\.\S+/.test(email)
    }
}
