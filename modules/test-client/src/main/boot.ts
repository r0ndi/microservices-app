import TestClient from './test-client'
import 'dotenv/config'

const MODULE_NAME = 'test-client'
process.title = MODULE_NAME

async function main() {
    process.on('unhandledRejection', up => {
        throw up
    })

    const apiUrl = process.env.API_URL || ''
    const testClient = TestClient(apiUrl)
    await testClient.createCustomer()
}

(async () => main())()
