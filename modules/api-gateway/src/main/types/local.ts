import { Request, Response, NextFunction } from 'express'
import { Customer } from './db'

export type ServerOptions = {
    port: number,
}

export interface ResponseBody {
    [key: string]: unknown
}

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

export interface AuthService {
    getCustomerByAuthorizationToken: (authorizationToken: string) => Promise<Customer | null>
    register: (request: Request, response: Response, next: NextFunction) => Promise<void>
    login: (request: Request, response: Response, next: NextFunction) => Promise<void>
}

export interface MqBridgeService {
    processRoute: (request: Request, response: Response, next: NextFunction) => Promise<void>
}

export interface RequestWithUser extends Request {
    authorizedWeb?: boolean
    customer?: Customer
    headers: any
    body: any
}

export interface TokenDataStored {
    id: string
}
