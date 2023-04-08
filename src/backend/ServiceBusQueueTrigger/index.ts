import { AzureFunction, Context } from "@azure/functions"
import { ServiceBusMQ } from "../services/messageQueue";
import { BlobDB } from "../services/db"
import { mqTrigger } from "../engine/commonTrigger";

const serviceBusQueue: AzureFunction = async function (context: Context, mySbMsg: any): Promise<void> {
    const mq = new ServiceBusMQ()
    const db = new BlobDB(process.env.AzureWebJobsStorage,"db", process.env.BLOB_STORAGE_CONTAINER)
    if(mySbMsg?.dbId){
        const data = await db.getByID(mySbMsg.dbId, mySbMsg.pipeline)
        mySbMsg = data
        //mySbMsg.aggregatedResults = data.aggregatedResults
        //db.deleteByID(mySbMsg.dbId)
    }
    
    context.log("Entering mqTrigger")
    await mqTrigger(context, mySbMsg, mq, db)
};

export default serviceBusQueue;
