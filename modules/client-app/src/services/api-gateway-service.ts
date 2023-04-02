import axios from 'axios'
import { ApiResponse } from '../types/local'

export default function ApiGatewayService() {
    async function post<T>(path: string, data: unknown = []): Promise<ApiResponse<T>> {
        try {
            const response = await axios.post(getApiUrl(path), data, getHeaders())
            return getSuccessResponse(response.data)
        } catch (error) {
            return getErrorResponse(error.message)
        }
    }

    async function get<T>(path: string): Promise<ApiResponse<T>> {
        try {
            const response = await axios.get(getApiUrl(path), getHeaders())
            return getSuccessResponse(response.data)
        } catch (error) {
            return getErrorResponse(error.message)
        }
    }

    function getHeaders() {
        const accessToken = localStorage.getItem('accessToken')
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } : {})
            }
        }
    }

    function getApiUrl(path: string): string {
        return `${process.env.REACT_APP_API_URL}/${path}`;
    }

    function getSuccessResponse<T>(responseData: T): ApiResponse<T> {
        return {
            data: responseData,
            error: null,
            status: true,
        }
    }

    function getErrorResponse<T>(errorMessage: string): ApiResponse<T> {
        return {
            error: errorMessage,
            data: {} as T,
            status: false,
        }
    }

    return { post, get }
}
