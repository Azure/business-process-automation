import { AzureFunction, Context } from "@azure/functions"
import { ServiceBusMQ } from "../services/messageQueue";
import { CosmosDB } from "../services/db"
import { mqTrigger } from "../engine/commonTrigger";

const serviceBusQueue: AzureFunction = async function (context: Context, mySbMsg: any): Promise<void> {
    const mq = new ServiceBusMQ()
    const db = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING,process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
    if(mySbMsg?.dbId){
        const data = await db.getByID(mySbMsg.dbId)
        mySbMsg.data = data.data
        mySbMsg.aggregatedResults = data.aggregatedResults
        //db.deleteByID(mySbMsg.dbId)
    }
    
    context.log("Entering mqTrigger")
    await mqTrigger(context, mySbMsg, mq, db)
};

export default serviceBusQueue;
