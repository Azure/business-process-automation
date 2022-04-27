import { AzureFunction, Context } from "@azure/functions"
import { Blob } from "../services/blob"

const blob : Blob = new Blob(process.env.AzureWebJobsStorage, process.env.BLOB_STORAGE_CONTAINER)

const blobTrigger: AzureFunction = async function (context: Context, myBlob: Buffer): Promise<void> {
    try {
        context.log(`Name of source doc to split : ${context.bindingData.blobTrigger}`)
        blob.split(myBlob,context.bindingData.blobTrigger )
    }
    catch (err) {
        context.log(err)
    }
};

export default blobTrigger;