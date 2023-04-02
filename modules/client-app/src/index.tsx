import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ApiGatewayService from './services/api-gateway-service'
import AuthService from './services/auth-service'
import { Customer } from './types/models'

const getSampleCustomer = () => {
    const randomStr = () => (Math.random() + 1).toString(36).substring(7)
    return {
        _id: 'notSetYet',
        firstname: 'John',
        lastname: 'Bravo',
        email: `john.bravo.${randomStr()}@gmail.com`,
        password: 'john!@#'
    }
}

const App = () => {
    const [results, setResults] = React.useState<string>()
    const [sampleCustomer, _] = React.useState<Customer>(getSampleCustomer())

    const apiGatewayService = ApiGatewayService()
    const authService = AuthService()

    const handleRegister = async () => {
        const response = await authService.register({
            email: sampleCustomer.email,
            password: sampleCustomer.password,
            firstname: sampleCustomer.firstname,
            lastname: sampleCustomer.lastname,
        })

        setResults(`Register response data: ${JSON.stringify(response)}`)
    }

    const handleLogin = async () => {
        const response = await authService.login(
            sampleCustomer.email,
            sampleCustomer.password,
        )

        setResults(`Login response data: ${JSON.stringify(response)}`)
    }

    const handleGetCustomer = async () => {
        const response = await apiGatewayService.post<Customer>('mq/query.customer.search')
        setResults(`Get customer response data: ${response.status ? JSON.stringify(response.data) : response.error}`)
    }

    return (
        <div>
            <h1>Your test client application!</h1>
            <div>
                <button onClick={handleRegister}>Register user</button>
                <button onClick={handleLogin}>Login user</button>
                <button onClick={handleGetCustomer}>Get logged customer</button>
            </div>
            {
                results ? (
                    <div>
                        <h2>Results:</h2>
                        <div>{results}</div>
                    </div>
                ) : ''
            }
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
