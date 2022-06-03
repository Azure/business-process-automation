import { CosmosClient, Item } from "@azure/cosmos"
import { BpaServiceObject } from "../engine/types"

export class CosmosDB {

    private _connectionString : string
    private _dbName : string
    private _containerName : string

    constructor(connectionString : string, dbName : string, containerName : string) {
        this._connectionString = connectionString
        this._dbName = dbName
        this._containerName = containerName
    }

    private _create = async (data) : Promise<any> => {
        try {
            const client = new CosmosClient(this._connectionString);
            console.log(`db: ${this._dbName}`)
            const database = client.database(this._dbName);
            const container = database.container(this._containerName);
            console.log(`container: ${this._containerName}`)
            const { resource: createdItem } = await container.items.create(data);
            return createdItem
        } catch (err) {
            console.log(err)
        }
        return null
    }

    public view = async (input : BpaServiceObject) : Promise<BpaServiceObject> => {
        await this._create(input)
        return input
    }
    
    public getConfig = async () : Promise<any> => {
        try{
            const client = new CosmosClient(this._connectionString);
            const database = client.database(this._dbName);
            const container = database.container(this._containerName);
            const item = await container.item("1").read()
            return item.resource
        } catch(err){
            console.log(err)
        }
        return null
    }

    public getDocSearchCustomSkillConfig = async () : Promise<any> => {
        try{
            const client = new CosmosClient(this._connectionString);
            const database = client.database(this._dbName);
            const container = database.container(this._containerName);
            const item = await container.item("2").read()
            return item.resource
        } catch(err){
            console.log(err)
        }
        return null
    }
}