// import { CosmosClient } from "@azure/cosmos"
// import { BpaPipelines, BpaServiceObject } from "../engine/types"

// export class CosmosDB {

//     private _connectionString : string
//     private _dbName : string
//     private _containerName : string
//     private _pipelinesLabel : string

//     constructor(connectionString : string, dbName : string, containerName : string) {
//         this._connectionString = connectionString
//         this._dbName = dbName
//         this._containerName = containerName
//         this._pipelinesLabel = "pipelines"
//     }

//     public create = async (data) : Promise<any> => {
//         try {
//             const client = new CosmosClient(this._connectionString);
//             //console.log(`db: ${this._dbName}`)
//             const database = client.database(this._dbName);
//             const container = database.container(this._containerName);
//             //console.log(`container: ${this._containerName}`)
//             const { resource: createdItem } = await container.items.upsert(data);
//             return createdItem
//         } catch (err) {
//             console.log(err)
//         }
//         return null
//     }

//     public view = async (input : BpaServiceObject) : Promise<BpaServiceObject> => {
//         await this.create(input)
//         return input
//     }
    
//     public getConfig = async () : Promise<BpaPipelines> => {
//         try{
//             const client = new CosmosClient(this._connectionString);
//             const database = client.database(this._dbName);
//             const container = database.container(this._containerName);
//             const item = await container.item(this._pipelinesLabel).read()
//             return item.resource
//         } catch(err){
//             console.log(err)
//         }
//         return null
//     }

//     // public getUnlockedAsyncTransactions = async () : Promise<any[]> => {
//     //     try{
//     //         const client = new CosmosClient(this._connectionString);
//     //         const database = client.database(this._dbName);
//     //         const container = database.container(this._containerName);
//     //         const items = await container.items.query("SELECT * from c WHERE c.type='async transaction'").fetchAll()
            
//     //         return items.resources
//     //     } catch(err){
//     //         console.log(err)
//     //     }
//     //     return null
//     // }

//     // public getDocSearchCustomSkillConfig = async () : Promise<any> => {
//     //     try{
//     //         const client = new CosmosClient(this._connectionString);
//     //         const database = client.database(this._dbName);
//     //         const container = database.container(this._containerName);
//     //         const item = await container.item(this._cogsearchLabel).read()
//     //         return item.resource
//     //     } catch(err){
//     //         console.log(err)
//     //     }
//     //     return null
//     // }
// }