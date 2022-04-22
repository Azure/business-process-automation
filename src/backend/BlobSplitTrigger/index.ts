import { AzureFunction, Context } from "@azure/functions"

const blobTrigger: AzureFunction = async function (context: Context, myBlob: Buffer): Promise<void> {
    try {
        context.log(`Name of source doc to split : ${context.bindingData.blobTrigger}`)
        
        
    }
    catch (err) {

    }
};

export default blobTrigger;