import { CosmosClient } from "@azure/cosmos"
import { MongoClient } from 'mongodb'
import { BpaPipelines, BpaServiceObject } from "../engine/types"
import { v4 as uuidv4 } from 'uuid';
import { BlobStorage } from "./storage";
const redis = require("redis")

export abstract class DB {

    protected _connectionString: string
    protected _dbName: string
    protected _containerName: string
    protected _pipelinesLabel: string

    constructor(connectionString: string, dbName: string, containerName: string) {
        this._connectionString = connectionString
        this._dbName = dbName
        this._containerName = containerName
        this._pipelinesLabel = "pipelines"
    }

    public abstract create(data): Promise<any>;
    // public abstract view(input: BpaServiceObject): Promise<any>
    public abstract getConfig(): Promise<BpaPipelines>
    public abstract getByID(id: string, pipeline: string): Promise<any>
    public abstract deleteByID(id: string): Promise<any>
}

export class BlobDB extends DB {

    //private _client: BlobStorage
    private _configClient : BlobStorage
    private _resultsClient : BlobStorage

    constructor(connectionString: string, dbName: string, containerName: string) {
        super(connectionString, dbName, containerName)
        this._configClient = new BlobStorage(connectionString, 'config')
        this._resultsClient = new BlobStorage(connectionString, 'results')
    }

    public connect = async () => {
        //await this._client.connect()
    }

    public createError = async (data: any): Promise<any> => {
        
        if(data?.aggregatedResults?.buffer){
            delete data.aggregatedResults.buffer
        }
        
        await this._resultsClient.upload(Buffer.from(JSON.stringify(data)), `error/${data.pipeline}/${data.filename}_${new Date().getTime()}.json`)

        return data
    }

    public create = async (data: any): Promise<any> => {

        let id : string
        if(data.id){
            id = data.id
        } else{
            id = uuidv4()
            data.id = id
        }
        
        if(data?.aggregatedResults?.buffer){
            delete data.aggregatedResults.buffer
        }
        
        await this._resultsClient.upload(Buffer.from(JSON.stringify(data)), `${data.pipeline}/${id}.json`)

        return data
    }

    // public view = async (input: any): Promise<BpaServiceObject> => {

    //     let id : string
    //     if(input.id){
    //         id = input.id
    //     } else{
    //         id = uuidv4()
    //     }
    //     await this._resultsClient.upload(Buffer.from(JSON.stringify(input)), `${input.pipeline}/${id}.json`)

    //     return input
    // }

    public getConfig = async (): Promise<BpaPipelines> => {

        return JSON.parse((await this._configClient.getBuffer('pipelines.json')).toString())
    }
    public getByID = async (id: string, pipeline: string): Promise<any> => {
        return JSON.parse((await this._resultsClient.getBuffer(`${pipeline}/${id}.json`)).toString())
    }
    public deleteByID = async (id: string): Promise<any> => {
        this._resultsClient.delete(id)
        return null
    }

}


export class Redis extends DB {

    private _client

    constructor(connectionString: string, dbName: string, containerName: string) {
        super(connectionString, dbName, containerName)
        const options = {
            url: connectionString,
            password: dbName,
        }
        this._client = redis.createClient(options)
    }

    public connect = async () => {
        await this._client.connect()
    }

    public create = async (data: any): Promise<any> => {
        const out = await this._client.set(uuidv4(), data)

        return
    }
    public view = async (input: BpaServiceObject): Promise<BpaServiceObject> => {
        await this.create(input)
        return input
    }
    public getConfig = async (): Promise<BpaPipelines> => {
        try {
            const out = await this._client.get(this._pipelinesLabel)

            return out
        } catch (err) {
            console.log(err)
        }
        return null
    }
    public getByID = async (id: string, pipeline: string): Promise<any> => {
        try {
            const out = await this._client.get(id)

            return out
        } catch (err) {
            console.log(err)
        }
        return null
    }
    public deleteByID = async (id: string): Promise<any> => {
        const out = await this._client.set(id, null)

        return out
    }

}

export class MongoDB extends DB {
    public getByID(id: string): Promise<any> {
        throw new Error("Method not implemented.")
    }
    public deleteByID(id: string): Promise<any> {
        throw new Error("Method not implemented.")
    }
    private _mongoClient: MongoClient

    constructor(connectionString: string, dbName: string, containerName: string) {
        super(connectionString, dbName, containerName)
        this._mongoClient = new MongoClient(connectionString)
    }

    public create = async (data): Promise<any> => {
        try {
            await this._mongoClient.connect()
            const db = this._mongoClient.db(this._dbName)
            const collection = db.collection(this._containerName)
            const insertResult = await collection.insertOne(data)

            return insertResult
        } catch (err) {
            console.log(err)
        } finally {
            this._mongoClient.close()
        }
        return null
    }

    public view = async (input: BpaServiceObject): Promise<BpaServiceObject> => {
        await this.create(input)
        return input
    }

    public getConfig = async (): Promise<any> => {
        try {
            await this._mongoClient.connect()
            const db = this._mongoClient.db(this._dbName)
            const collection = db.collection(this._containerName)
            const item = await collection.findOne({ _id: this._pipelinesLabel })
            return item as any
        } catch (err) {
            console.log(err)
        } finally {
            this._mongoClient.close()
        }
        return null
    }


}


export class CosmosDB extends DB {

    constructor(connectionString: string | undefined, dbName: string | undefined, containerName: string | undefined) {
        super(connectionString, dbName, containerName)

    }

    public create = async (data): Promise<any> => {

        const client = new CosmosClient(this._connectionString);
        //console.log(`db: ${this._dbName}`)
        const database = client.database(this._dbName);
        const container = database.container(this._containerName);
        //console.log(`container: ${this._containerName}`)
        const { resource: createdItem } = await container.items.upsert(data);
        return createdItem

    }

    public view = async (input: BpaServiceObject): Promise<any> => {
        const newItem = await this.create(input)

        return newItem
    }

    public getConfig = async (): Promise<BpaPipelines> => {

        const client = new CosmosClient(this._connectionString);
        const database = client.database(this._dbName);
        const container = database.container(this._containerName);
        const item = await container.item(this._pipelinesLabel).read()
        return item.resource

    }

    public getByID = async (id: string, pipeline: string): Promise<any> => {

        const client = new CosmosClient(this._connectionString);
        const database = client.database(this._dbName);
        const container = database.container(this._containerName);
        const item = await container.item(id).read()
        return item.resource

    }

    public deleteByID = async (id: string): Promise<any> => {

        const client = new CosmosClient(this._connectionString);
        const database = client.database(this._dbName);
        const container = database.container(this._containerName);
        const item = await container.item(id).delete();
        return item.resource

    }
}