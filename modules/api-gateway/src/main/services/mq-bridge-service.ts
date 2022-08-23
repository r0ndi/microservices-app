import { allowedRoutes } from '../settings'
import { HttpException } from '../exceptions/http-exception'
import { NextFunction, Request, Response } from 'express'
import { MQ } from 'shared-npm'
import StatusCodes from 'http-status-codes'

export function MqBridgeService(mq: MQ) {
    return {
        postPatchProcess,
        getProcess,
    }

    async function postPatchProcess(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const route = request.params.route
            validateRoute(route)

            const responseData = await mq.publish(route, request.body, [])
            response.send(responseData)
        } catch (error) {
            next(error)
        }
    }

    async function getProcess(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const route = request.params.route
            validateRoute(route)

            const responseData = await mq.publish(route, request.query, [])
            response.send(responseData)
        } catch (error) {
            next(error)
        }
    }

    function validateRoute(route: string): boolean {
        if (!allowedRoutes.includes(route)) {
            throw new HttpException(StatusCodes.FORBIDDEN, 'ForbiddenRoute', 'Forbidden route')
        }

        return true
    }
}
