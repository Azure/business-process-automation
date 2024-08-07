import { BlobServiceClient, BlockBlobClient, BlockBlobUploadResponse, ContainerClient } from "@azure/storage-blob";
import { BpaServiceObject } from "../engine/types";
import { BlobStorage } from "../services/storage"
import { PDFDocument } from "pdf-lib";
import p from "path"

export class SplitPdf {

    constructor() {

    }

    private _splitPdf = async (myBlob: Buffer, filename: string, directoryName: string, blobContainerClient : ContainerClient) => {

        const pdfDoc = await PDFDocument.load(myBlob)
        const numberOfPages = pdfDoc.getPages().length;
        //const result: Buffer[] = []
        for (let i = 0; i < numberOfPages; i++) {
            // Create a new "sub" document
            const subDocument = await PDFDocument.create();
            // copy the page at current index
            const [copiedPage] = await subDocument.copyPages(pdfDoc, [i])
            subDocument.addPage(copiedPage);
            const pdfBytes: Buffer = Buffer.from(await subDocument.save())
            //result.push(pdfBytes)
            console.log(`file-${i + 1}.pdf`)
            const newFilename = `${filename.replace(".pdf", `_${i}`)}.pdf`
            const blobClient: BlockBlobClient = blobContainerClient.getBlockBlobClient(p.join(directoryName, newFilename))
            const uploadBlobResponse: BlockBlobUploadResponse = await blobClient.upload(pdfBytes, pdfBytes.length)
            console.log(`uploadResponse : ${JSON.stringify(uploadBlobResponse)}`)
        }
        
    }

    // public split = async (myBlob: Buffer, filename: string, directoryName: string, blobContainerClient : ContainerClient): Promise<void> => {
    //     //const pages: Buffer[] = await this._splitPdf(myBlob)
    //     // let index = 0
    //     // for (const page of pages) {
    //     //     const newFilename = `${filename.replace(".pdf", `_${index}`)}.pdf`
    //     //     const blobClient: BlockBlobClient = blobContainerClient.getBlockBlobClient(p.join(directoryName, newFilename))
    //     //     const uploadBlobResponse: BlockBlobUploadResponse = await blobClient.upload(page, page.length)
    //     //     console.log(`uploadResponse : ${JSON.stringify(uploadBlobResponse)}`)
    //     //     index++
    //     // }

    // }

    public process = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        //const blob : BlobStorage = new BlobStorage(process.env.AzureWebJobsStorage, input.serviceSpecificConfig.containerName)
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AzureWebJobsStorage);
        const blobContainerClient = blobServiceClient.getContainerClient("documents");
        const folder: string = input.serviceSpecificConfig.folderName
        await this._splitPdf(input.data, input.filename, folder, blobContainerClient)
            
        return {
            data: "",
            label: "splitPdf",
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            type: "splitPdf",
            aggregatedResults: {}, //input.aggregatedResults,
            resultsIndexes: [], //input.resultsIndexes,
            index: index,
            id: input.id,
            vector: input.vector
        }
    }
    
}