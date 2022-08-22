export class HttpException extends Error {
    public code: string
    public status: number
    public message: string

    public static ERROR_CODE = 'somethingWentWrong'
    public static ERROR_MESSAGE = 'Something went wrong'

    constructor(status: number, code: string, message: string) {
        super(message)

        this.code = code
        this.status = status
        this.message = message
    }
}
