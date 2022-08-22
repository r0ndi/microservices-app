import TestClient from './test-client'
import * as shared from 'shared-npm'
import 'dotenv/config'

const MODULE_NAME = 'test-client'
process.title = MODULE_NAME

async function main() {
    process.on('unhandledRejection', up => {
        throw up
    })

    const mq = new shared.RabbitMQ.MQ(MODULE_NAME, {
        hostname: process.env.RABBITMQ_HOSTNAME,
        port: process.env.RABBITMQ_PORT,
    })

    await mq.connect()
    await TestClient(mq)
}

(async () => main())()
