import { Customer } from '../types/models';
import { LoginResponse, RegisterResponse } from '../types/remote'
import ApiGatewayService from './api-gateway-service'

export default function AuthService() {
    const apiGatewayService = ApiGatewayService()

    async function register(customer: Partial<Customer>): Promise<boolean> {
        const response = await apiGatewayService.post<RegisterResponse>('auth/register', customer)
        return response.status
    }

    async function login(email: string, password: string): Promise<boolean> {
        const response = await apiGatewayService.post<LoginResponse>('auth/login', { email, password })
        if (!response.status) {
            return false
        }

        localStorage.setItem('accessToken', response.data.token)
        return response.status
    }

    return { register, login }
}