export interface ApiResponse<T> {
    status: boolean
    error: string | null
    data: T
}
