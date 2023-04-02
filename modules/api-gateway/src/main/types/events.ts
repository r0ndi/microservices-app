export interface RegisterEvent {
    firstname: string
    lastname: string
    email: string
    password: string
}

export interface LoginEvent {
    email: string
    password: string
}
