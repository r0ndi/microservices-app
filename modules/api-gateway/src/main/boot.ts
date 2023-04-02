import 'dotenv/config'

import { Mongodb, MQ } from 'shared-npm'
import { Server } from './server'
import { AuthService } from './services/auth-service'
import { MqBridgeService } from './services/mq-bridge-service'

const MODULE_NAME = 'api-gateway'
process.title = MODULE_NAME

async function main() {
    process.on('unhandledRejection', up => {
        throw up
    })

    const tokenSecret = process.env.TOKEN_SECRET || ''
    const passwordSalt = parseInt(process.env.PASSWORD_SALT || '', 10)
    const mongodb = new Mongodb(process.env.MONGODB_DB_URL || '', MODULE_NAME)
    const mq = new MQ(MODULE_NAME, {
        hostname: process.env.RABBITMQ_HOSTNAME,
        port: process.env.RABBITMQ_PORT,
    })

    const db = await mongodb.connect()
    await mq.connect()

    const mqBridgeService = MqBridgeService(mq)
    const authService = AuthService(mq, db, passwordSalt, tokenSecret)

    const port = parseInt(process.env.NODE_SERVER_PORT || '', 0)
    const server = new Server({ port }, authService, mqBridgeService)
    server.listen()
}

(async () => main())()
