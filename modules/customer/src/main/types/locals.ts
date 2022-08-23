export interface ValidationResult {
    validation: boolean,
    error: string
}

export enum CustomerError {
    DEDUPLICATION = 'User already exists',
    EMPTY_FIRSTNAME = 'Firstname is empty',
    EMPTY_LASTNAME = 'Lastname is empty',
    EMPTY_EMAIL = 'Email is empty',
    INVALID_EMAIL = 'Email is invalid',
    INSERT = 'Customer insert error'
}
