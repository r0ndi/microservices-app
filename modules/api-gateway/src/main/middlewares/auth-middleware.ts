import { NextFunction, Response } from 'express'
import { HttpException } from '../exceptions/http-exception'
import { AuthService, RequestWithUser } from '../types/local'
import StatusCodes from 'http-status-codes'

export default (authService: AuthService) => async (request: RequestWithUser, response: Response, next: NextFunction): Promise<void> => {
    const authorization: string[] = request.headers.authorization ? request.headers.authorization.split(' ') : []
    const authorizationToken: string = authorization.length > 0 ? authorization[1] : ''

    if (!authorizationToken) {
        next(new HttpException(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'Unauthorized user'))
        return
    }

    const customer = await authService.getCustomerByAuthorizationToken(authorizationToken)
    if (!customer) {
        next(new HttpException(StatusCodes.UNAUTHORIZED, 'InvalidAuthToken', 'Invalid authorization token'))
        return
    }

    request.customer = customer
    next()
}
