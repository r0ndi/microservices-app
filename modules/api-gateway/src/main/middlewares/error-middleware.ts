import {NextFunction, Request, Response} from 'express'
import {HttpException} from '../exceptions/http-exception'
import StatusCodes from 'http-status-codes'

export function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction): void {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR
    const message = error.message || HttpException.ERROR_MESSAGE
    const errorCode = error.code || HttpException.ERROR_CODE

    response.status(status).json({ errorCode, error: message }).send()
}
