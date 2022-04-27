//import { BpaServiceObject } from "../engine/types"
import { BlobServiceClient, ContainerClient, BlockBlobClient, BlockBlobUploadResponse } from "@azure/storage-blob"
const PDFDocument = require('pdf-lib').PDFDocument;

export class Blob {

    private _blobServiceClient : BlobServiceClient
    private _blobContainerClient : ContainerClient

    constructor(connectionString : string, containerName : string) {
        this._blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        this._blobContainerClient = this._blobServiceClient.getContainerClient(containerName);
    }

    public split = async (myBlob : Buffer, filename : string) : Promise<void> => {
        const pages : Buffer[] = await this._splitPdf(myBlob)
        let index = 0
        for(const page of pages){
            const blobClient : BlockBlobClient = this._blobContainerClient.getBlockBlobClient(`${filename.replace(".pdf",`_${index}`)}.pdf`)
            const uploadBlobResponse : BlockBlobUploadResponse = await blobClient.upload(page, page.length)
            console.log(`uploadResponse : ${JSON.stringify(uploadBlobResponse)}`)
            index++
        }
        
    }

    private _splitPdf = async (myBlob : Buffer) : Promise<Buffer[]> => {

        const pdfDoc = await PDFDocument.load(myBlob)
        const numberOfPages = pdfDoc.getPages().length;
        const result : Buffer[] = []
        for (let i = 0; i < numberOfPages; i++) {
            // Create a new "sub" document
            const subDocument = await PDFDocument.create();
            // copy the page at current index
            const [copiedPage] = await subDocument.copyPages(pdfDoc, [i])
            subDocument.addPage(copiedPage);
            const pdfBytes = await subDocument.save()
            result.push(pdfBytes)
            console.log(`file-${i + 1}.pdf`)
            //await writePdfBytesToFile(`out/file-${i + 1}.pdf`, pdfBytes);
        }
        return result
    }

    
}