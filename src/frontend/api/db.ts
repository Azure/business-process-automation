import { CosmosClient } from "@azure/cosmos"
import { MongoClient } from 'mongodb'

export abstract class DB {

    protected _connectionString : string
    protected _dbName : string
    protected _containerName : string
    protected _pipelinesLabel : string

    constructor(connectionString : string, dbName : string, containerName : string){
        this._connectionString = connectionString
        this._dbName = dbName
        this._containerName = containerName
        this._pipelinesLabel = "pipelines"
    }

    public abstract count() : Promise<any>;
    public abstract create(data: any) : Promise<any>;
    public abstract getConfig() : Promise<any>;
    public abstract delete(id: string) : Promise<any>;
}

export class MongoDB extends DB {
    private _mongoClient : MongoClient

    constructor(connectionString : string, dbName : string, containerName : string) {
        super(connectionString, dbName, containerName)
        this._mongoClient = new MongoClient(connectionString)
    }

    public count = async () : Promise<number> => {
        try {
            await this._mongoClient.connect()
            const db = this._mongoClient.db(this._dbName)
            const collection = db.collection(this._containerName)
            return await collection.countDocuments()
        } catch (err) {
            console.log(err)
        } finally{
            this._mongoClient.close()
        }
        return -1
    }

    public create = async (data) : Promise<any> => {
        try {
            await this._mongoClient.connect()
            const db = this._mongoClient.db(this._dbName)
            const collection = db.collection(this._containerName)
            data._id = data.id
            const insertResult = await collection.replaceOne({_id : data._id},data)
            return insertResult
        } catch (err) {
            console.log(err)
        } finally{
            this._mongoClient.close()
        }
        return null
    }

    public delete = async (id : string) : Promise<any> => {
        try {
            await this._mongoClient.connect()
            const db = this._mongoClient.db(this._dbName)
            const collection = db.collection(this._containerName)
            const insertResult = await collection.deleteOne({_id : id})
            return id
        } catch (err) {
            console.log(err)
        } finally{
            this._mongoClient.close()
        }
        return null
    }

    public get = async (id : string) : Promise<any> => {
        try {
            await this._mongoClient.connect()
            const db = this._mongoClient.db(this._dbName)
            const collection = db.collection(this._containerName)
            const item = await collection.findOne({_id : id})
            return item as any
        } catch (err) {
            console.log(err)
        } finally{
            this._mongoClient.close()
        }
        return null
    }

    
    public getConfig = async () : Promise<any> => {
        try {
            await this._mongoClient.connect()
            const db = this._mongoClient.db(this._dbName)
            const collection = db.collection(this._containerName)
            const item = await collection.findOne({_id : this._pipelinesLabel})
            return item as any
        } catch (err) {
            console.log(err)
        } finally{
            this._mongoClient.close()
        }
        return null
    }


}


export class CosmosDB extends DB {

    constructor(connectionString : string, dbName : string, containerName : string) {
        super(connectionString, dbName, containerName)
        
    }

    public count = async () : Promise<number> => {

        const client = new CosmosClient(this._connectionString);
        const database = client.database(this._dbName);
        const container = database.container(this._containerName);
        const out = await container.items.query('SELECT VALUE COUNT(1) FROM c', {maxItemCount: -1}).fetchAll();
        
        if(out?.resources.length > 0){
            return out.resources[0]
        } 

        return 0
    }

    public create = async (data : any) : Promise<any> => {
        try {
            const client = new CosmosClient(this._connectionString);
            //console.log(`db: ${this._dbName}`)
            const database = client.database(this._dbName);
            const container = database.container(this._containerName);
            //console.log(`container: ${this._containerName}`)
            const { resource: createdItem } = await container.items.upsert(data);
            return createdItem
        } catch (err) {
            console.log(err)
        }
        return null
    }

    public delete = async (id : string) : Promise<any> => {
        try {
            const client = new CosmosClient(this._connectionString);
            //console.log(`db: ${this._dbName}`)
            const database = client.database(this._dbName);
            const container = database.container(this._containerName);
            //console.log(`container: ${this._containerName}`)
            await container.item(id).delete()
            return true
        } catch (err) {
            console.log(err)
        }
        return null
    }
    
    public getConfig = async () : Promise<any> => {
        try{
            const client = new CosmosClient(this._connectionString);
            const database = client.database(this._dbName);
            const container = database.container(this._containerName);
            const item = await container.item(this._pipelinesLabel).read()
            return item.resource
        } catch(err){
            console.log(err)
        }
        return null
    }

    public get = async (id: string) : Promise<any> => {
        try{
            const client = new CosmosClient(this._connectionString);
            const database = client.database(this._dbName);
            const container = database.container(this._containerName);
            const item = await container.item(id).read()
            return item.resource
        } catch(err){
            console.log(err)
        }
        return null
    }

    public getAll = async (pipeline: string) : Promise<any> => {
        try{
            const client = new CosmosClient(this._connectionString);
            const database = client.database(this._dbName);
            const container = database.container(this._containerName);
            const items = await container.items.query(`SELECT * FROM c WHERE c.pipeline = '${pipeline}'`).fetchAll()
            return items.resources
        } catch(err){
            console.log(err)
        }
        return null
    }
}