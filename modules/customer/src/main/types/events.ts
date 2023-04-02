export type CustomerRegisterEvent = {
    _id: string
    firstname: string
    lastname: string
    email: string
}

export type CustomerQuery = {
    customer_id: string
    firstname?: string
    lastname?: string
    email?: string
}
