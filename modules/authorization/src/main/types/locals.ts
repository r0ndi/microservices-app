export interface ValidationResult {
    validation: boolean,
    error: string
}

export enum RegisterError {
    DEDUPLICATION = 'User already exists',
    EMPTY_FIRSTNAME = 'Firstname is empty',
    EMPTY_LASTNAME = 'Lastname is empty',
    EMPTY_PASSWORD = 'Password is empty',
    EMPTY_EMAIL = 'Email is empty',
    INVALID_EMAIL = 'Email is invalid',
    INSERT = 'Customer insert error'
}

export enum LoginError {
    WRONG_CREDENTIALS = 'Wrong credentials',
    EMPTY_PASSWORD = 'Password is empty',
    EMPTY_EMAIL = 'Email is empty',
    INVALID_EMAIL = 'Email is invalid',
}
