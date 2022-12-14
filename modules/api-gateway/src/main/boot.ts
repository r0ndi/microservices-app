import 'dotenv/config'

import { MQ } from 'shared-npm'
import { Server } from './server'

const MODULE_NAME = 'api-gateway'
process.title = MODULE_NAME

async function main() {
    process.on('unhandledRejection', up => {
        throw up
    })

    const mq = new MQ(MODULE_NAME, {
        hostname: process.env.RABBITMQ_HOSTNAME,
        port: process.env.RABBITMQ_PORT,
    })
    await mq.connect()

    const port = parseInt(process.env.NODE_SERVER_PORT || '', 0)
    const server = new Server({ port }, mq)
    server.listen()
}

(async () => main())()
