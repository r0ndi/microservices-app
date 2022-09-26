export interface RegisterEvent {
    firstname: string
    lastname: string
    email: string
    password: string
}

export interface EventResponse {
    success: boolean
}

export interface AuthorizationEventResponse extends EventResponse {
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
