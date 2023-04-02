import { allowedRoutes } from '../settings'
import { HttpException } from '../exceptions/http-exception'
import { NextFunction, Response } from 'express'
import { MQ } from 'shared-npm'
import StatusCodes from 'http-status-codes'
import { MqBridgeService, RequestWithUser } from '../types/local'

export function MqBridgeService(mq: MQ): MqBridgeService {
    async function processRoute(request: RequestWithUser, response: Response, next: NextFunction): Promise<void> {
        try {
            const route = request.params.route
            const payload = {
                customer_id: request.customer?._id,
                ...(request.method === 'post' ? request.query : request.body)
            }

            if (!isValidRoute(route)) {
                throw new HttpException(StatusCodes.FORBIDDEN, 'ForbiddenRoute', 'Forbidden route')
            }

            const responseData = await mq.publish(route, payload, [])
            response.send(responseData)
        } catch (error) {
            next(error)
        }
    }

    function isValidRoute(route: string): boolean {
        return allowedRoutes.includes(route)
    }

    return {
        processRoute,
    }
}
