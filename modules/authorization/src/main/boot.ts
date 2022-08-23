import { Mongodb, MQ } from 'shared-npm'
import Authorization from './authorization'
import 'dotenv/config'

const MODULE_NAME = 'authorization'
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

    await Authorization(mq, db, passwordSalt, tokenSecret)
}

(async () => main())()
