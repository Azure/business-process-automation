import { BpaServiceObject } from "../engine/types"
import { BlobServiceClient, ContainerClient, BlockBlobClient, BlockBlobUploadResponse } from "@azure/storage-blob"

export class Blob {

    private _blobServiceClient : BlobServiceClient
    private _blobContainerClient : ContainerClient

    constructor(connectionString : string, containerName : string) {
        this._blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        this._blobContainerClient = this._blobServiceClient.getContainerClient(containerName);
    }

    public split = async (input : BpaServiceObject) : Promise<BpaServiceObject> => {
        
        const blobClient : BlockBlobClient = this._blobContainerClient.getBlockBlobClient(input.projectName)
        const uploadBlobResponse : BlockBlobUploadResponse = await blobClient.upload(input.data, input.data.length)

        const result : BpaServiceObject = {
            label : input.label,
            data : uploadBlobResponse.errorCode,
            type : "blobUploadError",
            bpaId : input.bpaId,
            projectName : input.projectName
        }

        return result
    }

    
}