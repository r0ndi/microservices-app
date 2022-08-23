export interface RegisterEvent {
    firstname: string
    lastname: string
    email: string
    password: string
}

export interface AuthorizationEventResponse {
    success: boolean
    token?: string
}

export interface CustomerCreatedEvent {
    id: string
    firstname: string
    lastname: string
    email: string
    password: string
}

export interface LoginEvent {
    email: string
    password: string
}
