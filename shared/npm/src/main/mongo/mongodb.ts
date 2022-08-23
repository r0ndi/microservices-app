import { MongoClient, Db } from 'mongodb'

export class Mongodb {
    private readonly url: string
    private readonly db: string
    private readonly client: MongoClient

    constructor(url: string, db: string) {
        this.url = url
        this.db = db

        this.client = new MongoClient(this.url)
    }

    public async connect(): Promise<Db> {
        await this.client.connect()
        return this.client.db(this.db)
    }
}
