import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosDB, MongoDB } from "../db";

let db = null
if (process.env.USE_LOCAL_STORAGE === 'true') {
    db = new MongoDB(process.env.MONGO_DB_CONNECTION_STRING, process.env.MONGO_DB_DB, process.env.MONGO_DB_CONTAINER)
} else {
    db = new CosmosDB(process.env.COSMOS_DB_CONNECTION_STRING, process.env.COSMOS_DB_DB, process.env.COSMOS_DB_CONTAINER)
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    try {
        const result = await db.getAll(req.query.pipeline)
        context.res = {
            body: result
        }
    } catch (err) {
        context.log(err)
        context.res = {
            body: err
        }
    }


};


export default httpTrigger;
