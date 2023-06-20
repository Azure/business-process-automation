import { BlobServiceClient, ContainerClient, BlockBlobClient, BlockBlobUploadResponse, BlobClient } from "@azure/storage-blob"

export class BlobStorage {

    private _blobServiceClient: BlobServiceClient
    private _blobContainerClient: ContainerClient
    private _containerName : string

    constructor(connectionString: string, containerName: string) {
        this._blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        this._blobContainerClient = this._blobServiceClient.getContainerClient(containerName);
        this._containerName = containerName;
    }

    private compareDates = (a, b) : number => {
        const date1 = new Date(a.properties.createdOn)
        const date2 = new Date(b.properties.createdOn)
        return date2.getTime() - date1.getTime()
    }

    public getAll = async (pipeline : string): Promise<string[]> => {
        const tempOut = []
        const blobsFlat = await this._blobContainerClient.listBlobsFlat({prefix: `${pipeline}/`})
        for await (const blob of blobsFlat){
            tempOut.push(blob)
        }
        const out = tempOut.sort(this.compareDates)
        return out.map(a => a.name)
    }

    public getBuffer = async (filename: string): Promise<Buffer> => {
        try{
            const blobClient: BlobClient = this._blobContainerClient.getBlobClient(filename)
            const exists = await blobClient.exists()
            if(exists){
                return await blobClient.downloadToBuffer()
            }
        }catch(e){
            console.log(e)
        }
       
        return null
    }

    public upload = async (myBlob: Buffer, filename: string): Promise<void> => {
        const blobClient: BlockBlobClient = this._blobContainerClient.getBlockBlobClient(filename)
        const uploadBlobResponse: BlockBlobUploadResponse = await blobClient.upload(myBlob, myBlob.length)
        console.log(`uploadResponse : ${JSON.stringify(uploadBlobResponse)}`)
    }

    public delete = async (filename: string): Promise<void> => {
        const blobClient: BlockBlobClient = this._blobContainerClient.getBlockBlobClient(filename)
        await blobClient.deleteIfExists()
    }
}