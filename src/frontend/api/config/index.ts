import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosDB, MongoDB, BlobDB } from "../db";


// let db = null
// if(process.env.USE_LOCAL_STORAGE === 'true'){
//     db = new MongoDB(process.env.MONGO_DB_CONNECTION_STRING, process.env.MONGO_DB_DB, process.env.MONGO_DB_CONTAINER )
// } else{
//     db = new CosmosDB(process.env.COSMOS_DB_CONNECTION_STRING, process.env.COSMOS_DB_DB, process.env.COSMOS_DB_CONTAINER )
// }

const db = new BlobDB(process.env.BLOB_STORAGE_CONNECTION_STRING, "", 'config')

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if (req.method === "POST") {
        try {
            context.log('HTTP trigger function processed a request.');
            const out = await db.setConfig(req.body)
            context.res = {
                body: out
            }
        } catch (err) {``
            context.log(err)
            context.res = {
                body: err
            }
            return
        } 
    } else if(req.method === "DELETE"){
        try{
            const result = await deleteConfig(req.query.id, req.query.name);
            context.res = {
                body : "deleted"
            }
        } catch(err){
            context.log(err)
            context.res = {
                body: err
            }
        }

    }else {
        try{
            const result = await db.getConfig()
            context.res = {
                body : result
            }
        } catch(err){
            context.log(err)
            context.res = {
                body: err
            }
        }
        
    }
};

const deleteConfig = async (id, name) : Promise<any> => {
    try{
        const item = await db.get(id)
        const newPipelines = [];
        if(item?.resource?.pipelines){
            for(const pipeline of item.pipelines){
                if(pipeline.name !== name){
                    newPipelines.push(pipeline)
                }
            }
            await db.create(newPipelines);
            return true
        }
    } catch(err){
        console.log(err)
    }
    return null
}

export default httpTrigger;
