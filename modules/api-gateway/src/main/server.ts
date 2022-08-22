import * as express from 'express'
import { ServerOptions } from './types/local'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { MqBridgeService } from './services/mq-bridge-service'
import * as shared from 'shared-npm'
import { errorMiddleware } from './middlewares/error-middleware'

export class Server {
    private readonly mq: shared.RabbitMQ.MQ
    private readonly app: express.Application
    private readonly options: ServerOptions

    public constructor(options: ServerOptions, mq: shared.RabbitMQ.MQ) {
        this.options = options
        this.app = express()
        this.mq = mq

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
        const mqProcessor = MqBridgeService(this.mq)

        this.app.patch('/mq/:route', mqProcessor.postPatchProcess)
        this.app.post('/mq/:route', mqProcessor.postPatchProcess)
        this.app.get('/mq/:route', mqProcessor.getProcess)
    }
}
