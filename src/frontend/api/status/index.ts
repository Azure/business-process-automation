import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosDB, MongoDB, DB } from "../db";
import { AzureServiceBus } from "../queue";

let db : DB = new CosmosDB(process.env.COSMOS_DB_CONNECTION_STRING, process.env.COSMOS_DB_DB, process.env.COSMOS_DB_CONTAINER )
if(process.env.USE_LOCAL_STORAGE === 'true'){
    db = new MongoDB(process.env.MONGO_DB_CONNECTION_STRING, process.env.MONGO_DB_DB, process.env.MONGO_DB_CONTAINER )
}

let sb = new AzureServiceBus()

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    try {
        context.log('HTTP trigger function processed a request.');

        const fileCount = 0//await db.count()
        const messages = await sb.status()

        context.res = {
            body: {
                count : fileCount,
                messages : messages
            }
        }
    } catch (err) {
        context.log(err)
        context.res = {
            body: err
        }
    }
    return
}

export default httpTrigger;
