import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobServiceClient } from '@azure/storage-blob';
import * as fs from 'fs';


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if (req.method === "GET") {
        try {
            // Create the BlobServiceClient object which will be used to create a container client
            const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.BLOB_STORAGE_CONNECTION_STRING);
            // Get a reference to a container
            let containerClient = blobServiceClient.getContainerClient(process.env.BLOB_STORAGE_CONTAINER);
            if(req?.query?.container){
                containerClient = blobServiceClient.getContainerClient(req.query.container);
            }
            const blobClient = containerClient.getBlobClient(req.query.filename)
            const blockBlobClient = blobClient.getBlockBlobClient()
            
            
            // Get a block blob client
            
            context.res = {
                headers: {"Content-Type":"application/pdf"},
                body: await blobClient.downloadToBuffer()
            }
        } catch (err) {
            ``
            context.log(err)
            context.res = {
                body: err
            }
            return
        }
    }
};

export default httpTrigger;
