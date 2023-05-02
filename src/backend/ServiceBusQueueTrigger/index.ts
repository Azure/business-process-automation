import { AzureFunction, Context } from "@azure/functions"
import { ServiceBusMQ } from "../services/messageQueue";
import { BlobDB } from "../services/db"
import { mqTrigger } from "../engine/commonTrigger";
import { BlobStorage } from "../services/storage";


const getFileDirNames = (mySbMsg) => {
    let directoryName = ""
    let filename = ""
    if (mySbMsg?.filename) {
        directoryName = mySbMsg.pipeline
        filename = mySbMsg.fileName
    } else {
        filename = mySbMsg.subject.split("/documents/blobs/")[1]
        directoryName = filename.split('/')[0]
    }
    return { filename: filename, directoryName: directoryName }
}

const serviceBusQueue: AzureFunction = async function (context: Context, mySbMsg: any): Promise<void> {
    const mq = new ServiceBusMQ()
    const db = new BlobDB(process.env.AzureWebJobsStorage,"db", process.env.BLOB_STORAGE_CONTAINER)
    try{
        if(!mySbMsg?.subject){
            const data = await db.getByID(mySbMsg.id, mySbMsg.pipeline)
            mySbMsg = data
            const resultsBlob : BlobStorage = new BlobStorage(process.env.AzureWebJobsStorage, 'documents')
            mySbMsg.aggregatedResults.buffer = await resultsBlob.getBuffer(mySbMsg.filename)
        }
        
        context.log("Entering mqTrigger")
        await mqTrigger(context, mySbMsg, mq, db)
    } catch(err){
        const names = getFileDirNames(mySbMsg)
        db. createError(
            {
                filename : names.filename,
                error : err.toString(),
                request : JSON.stringify(mySbMsg),
                pipeline : names.directoryName
            }
        )

        throw err
    }
    
};

export default serviceBusQueue;
