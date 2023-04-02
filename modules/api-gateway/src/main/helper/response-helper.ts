import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseBody } from '../types/local'

const responseHelper = {
    successResponse: (response: Response, responseBody: ResponseBody = {}, statusCode: StatusCodes = StatusCodes.OK): void => {
        response.status(statusCode)
        response.json({ ...responseBody, status: true })
        response.send()
    },
    errorResponse: (response: Response, error: string, statusCode: StatusCodes = StatusCodes.BAD_REQUEST): void => {
        response.status(statusCode)
        response.json({ error, status: false })
        response.send()
    },
}

export default responseHelper
