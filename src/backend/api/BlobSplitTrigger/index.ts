import { AzureFunction, Context } from "@azure/functions"
import { BlobStorage } from "../services/storage"

const blob : BlobStorage = new BlobStorage(process.env.AzureWebJobsStorage, process.env.BLOB_STORAGE_CONTAINER)

const blobTrigger: AzureFunction = async function (context: Context, myBlob: Buffer): Promise<void> {
    try {
        context.log(`Name of source doc to split : ${context.bindingData.blobTrigger}`)
        const directoryName = context.bindingData.blobTrigger.split('/')[1]
        blob.split(myBlob, context.bindingData.blobTrigger, directoryName )
    }
    catch (err) {
        context.log(err)
    }
};

export default blobTrigger;