const { BlobServiceClient } = require('@azure/storage-blob');
import * as fs from 'fs';

export const upload2BlobStorage = async (filename) => {

    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.BLOB_STORAGE_CONNECTION_STRING);
    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(process.env.BLOB_STORAGE_CONTAINER);
    // Get a block blob client
    const filenameSplit = filename.split("/")
    const zipFilename = filenameSplit[filenameSplit.length - 1]
    const blockBlobClient = containerClient.getBlockBlobClient(zipFilename);
    const buf = fs.readFileSync(filename)
    const uploadBlobResponse = await blockBlobClient.upload(buf, buf.length);
    console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);

    return true
}

export const upload2BlobSplitStorage = async (filename) => {

    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.BLOB_STORAGE_CONNECTION_STRING);
    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(process.env.BLOB_STORAGE_SPLIT_CONTAINER);
    // Get a block blob client
    const filenameSplit = filename.split("/")
    const zipFilename = filenameSplit[filenameSplit.length - 1]
    const blockBlobClient = containerClient.getBlockBlobClient(zipFilename);
    const buf = fs.readFileSync(filename)
    const uploadBlobResponse = await blockBlobClient.upload(buf, buf.length);
    console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);

    return true
}
