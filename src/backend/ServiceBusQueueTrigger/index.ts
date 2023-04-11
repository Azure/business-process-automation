import { AzureFunction, Context } from "@azure/functions"
import { ServiceBusMQ } from "../services/messageQueue";
import { BlobDB } from "../services/db"
import { mqTrigger } from "../engine/commonTrigger";
import { BlobStorage } from "../services/storage";

const serviceBusQueue: AzureFunction = async function (context: Context, mySbMsg: any): Promise<void> {
    const mq = new ServiceBusMQ()
    const db = new BlobDB(process.env.AzureWebJobsStorage,"db", process.env.BLOB_STORAGE_CONTAINER)
    if(!mySbMsg?.subject){
        const data = await db.getByID(mySbMsg.id, mySbMsg.pipeline)
        mySbMsg = data
        const resultsBlob : BlobStorage = new BlobStorage(process.env.AzureWebJobsStorage, 'documents')
        mySbMsg.aggregatedResults.buffer = await resultsBlob.getBuffer(mySbMsg.filename)
    }
    
    context.log("Entering mqTrigger")
    await mqTrigger(context, mySbMsg, mq, db)
};

export default serviceBusQueue;
