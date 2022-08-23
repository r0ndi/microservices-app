import axios, { AxiosResponse } from 'axios'

const randomStr = () => (Math.random() + 1).toString(36).substring(7)

const sampleCustomer = {
    firstname: 'John',
    lastname: 'Bravo',
    email: `john.bravo.${randomStr()}@gmail.com`,
    password: 'john!@#'
}

export default function TestClient(apiUrl: string) {
    return {
        createCustomer,
    }

    async function createCustomer() {
        await register()
        await login()
        await findUser()
    }

    async function register(): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(`${apiUrl}/mq/command.authorization.register`, { ...sampleCustomer })
            console.log(`Register = ${response.status}: ${JSON.stringify(response.data)}`)
            return response.data
        } catch (error) {
            console.log(`Error: ${error.message}`)
        }
    }

    async function login(): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(`${apiUrl}/mq/command.authorization.login`, {
                email: sampleCustomer.email,
                password: sampleCustomer.password
            })

            console.log(`Login = ${response.status}: ${JSON.stringify(response.data)}`)
            return response.data
        } catch (error) {
            console.log(`Error: ${error.message}`)
        }
    }

    async function findUser(): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(`${apiUrl}/mq/query.customer.search`, {
                email: sampleCustomer.email,
            })

            console.log(`Find user = ${response.status}: ${JSON.stringify(response.data)}`)
            return response.data
        } catch (error) {
            console.log(`Error: ${error.message}`)
        }
    }
}
