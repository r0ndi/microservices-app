import { Mongodb, MQ } from 'shared-npm'
import Customer from './customer'
import 'dotenv/config'

const MODULE_NAME = 'customer'
process.title = MODULE_NAME

async function main() {
    process.on('unhandledRejection', up => {
        throw up
    })

    const mongodb = new Mongodb(process.env.MONGODB_DB_URL || '', MODULE_NAME)
    const mq = new MQ(MODULE_NAME, {
        hostname: process.env.RABBITMQ_HOSTNAME,
        port: process.env.RABBITMQ_PORT,
    })

    const db = await mongodb.connect()
    await mq.connect()

    await Customer(mq, db)
}

(async () => main())()
