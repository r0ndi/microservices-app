import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import { errorMiddleware } from './middlewares/error-middleware'
import helmet from 'helmet'
import { AuthService, MqBridgeService, ServerOptions } from './types/local'
import authMiddleware from './middlewares/auth-middleware'
import * as cors from 'cors'

export class Server {
    private readonly app: express.Application
    private readonly options: ServerOptions
    private readonly authService: AuthService
    private readonly mqBridgeService: MqBridgeService

    public constructor(options: ServerOptions, authService: AuthService, mqBridgeService: MqBridgeService) {
        this.mqBridgeService = mqBridgeService
        this.authService = authService
        this.options = options
        this.app = express()

        this.setup()
    }

    public listen = (): void => {
        this.app.listen(this.options.port, () => {
            console.log(`Server starting on ${this.options.port}`)
        })
    }

    private setup = (): void => {
        this.initializeMiddlewares()
        this.initializeRoutes()
        this.initializeErrorHandling()
    }

    private initializeMiddlewares = (): void => {
        this.app.use(bodyParser.json())
        this.app.use(cookieParser())
        this.app.use(cors())

        this.app.use(helmet.contentSecurityPolicy())
        this.app.use(helmet.dnsPrefetchControl())
        this.app.use(helmet.expectCt())
        this.app.use(helmet.frameguard())
        this.app.use(helmet.hidePoweredBy())
        this.app.use(helmet.hsts())
        this.app.use(helmet.ieNoOpen())
        this.app.use(helmet.noSniff())
        this.app.use(helmet.referrerPolicy())
        this.app.use(helmet.xssFilter())
    }

    private initializeErrorHandling = (): void => {
        this.app.use(errorMiddleware)
    }

    private initializeRoutes = (): void => {
        this.app.post('/mq/:route', authMiddleware(this.authService), this.mqBridgeService.processRoute)
        this.app.get('/mq/:route', authMiddleware(this.authService), this.mqBridgeService.processRoute)

        this.app.post('/auth/register', this.authService.register)
        this.app.post('/auth/login', this.authService.login)
    }
}
