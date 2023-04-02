import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Db } from 'mongodb'
import { MQ, UUID } from 'shared-npm'
import { Customer } from '../types/db'
import { AuthorizationValidator } from '../validations/authorization-validator'
import * as bcryptjs from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { LoginEvent, RegisterEvent } from '../types/events'
import { AuthService, LoginError, TokenDataStored } from '../types/local'
import responseHelper from '../helper/response-helper'

export function AuthService(mq: MQ, db: Db, passwordSalt: number, tokenSecret: string): AuthService {
    const customersCollection = db.collection<Customer>('customers')

    async function register(request: Request, response: Response): Promise<void> {
        const event: RegisterEvent = request.body
        const validationResult = await AuthorizationValidator.registerEvent(customersCollection, event)
        if (validationResult.length) {
            return responseHelper.errorResponse(response, validationResult[0].error)
        }

        const customerId = UUID.generate()
        const hashedPassword = await bcryptjs.hash(event.password, passwordSalt)

        const customer: Partial<Customer> = { ...event, _id: customerId }
        delete customer.password

        await customersCollection.insertOne({ _id: customerId, email: event.email, password: hashedPassword })
        await mq.publish('event.api-gateway.register.success', { ...customer })
        return responseHelper.successResponse(response)
    }

    async function login(request: Request, response: Response): Promise<void> {
        const event: LoginEvent = request.body
        const validationResult = AuthorizationValidator.loginEvent(event)
        if (validationResult.length) {
            return responseHelper.errorResponse(response, validationResult[0].error)
        }

        const customer = await customersCollection.findOne<Customer>({ email: event.email })
        if (!customer) {
            return responseHelper.errorResponse(response, LoginError.WRONG_CREDENTIALS, StatusCodes.UNAUTHORIZED)
        }

        const isMatchedPassword = await bcryptjs.compare(event.password, customer.password ?? '')
        if (!isMatchedPassword) {
            return responseHelper.errorResponse(response, LoginError.WRONG_CREDENTIALS, StatusCodes.UNAUTHORIZED)
        }

        const token = jwt.sign({ id: customer._id }, tokenSecret, { expiresIn: 60 * 60 * 24 })
        await mq.publish('event.api-gateway.login.success', { _id: customer._id })
        return responseHelper.successResponse(response, { token })
    }

    async function getCustomerByAuthorizationToken(authorizationToken: string): Promise<Customer | null> {
        const tokenDataStored = jwt.verify(authorizationToken, tokenSecret) as TokenDataStored
        return customersCollection.findOne({ _id: tokenDataStored.id })
    }

    return {
        getCustomerByAuthorizationToken,
        register,
        login,
    }
}
