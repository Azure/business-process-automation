import { readFileSync } from "fs"
import p from "path"
import { BlobServiceClient, ContainerClient, BlockBlobClient, BlockBlobUploadResponse, BlobClient, ContainerSASPermissions, StorageSharedKeyCredential, ContainerGenerateSasUrlOptions } from "@azure/storage-blob"
import { BpaServiceObject } from "../engine/types";
import { writeFile } from "fs/promises";
import { range } from "lodash"
import { PDFDocument } from "pdf-lib";


export abstract class Storage {

    constructor() {

    }

    //public abstract copy(input : BpaServiceObject) : Promise<BpaServiceObject>
    public abstract getBuffer(filename: string): Promise<Buffer>;
    //public abstract conditionalCopy(input : BpaServiceObject) : Promise<BpaServiceObject>
    public abstract toTxt(input: BpaServiceObject): Promise<BpaServiceObject>
    public abstract split(myBlob: Buffer, filename: string, directoryName: string): Promise<void>
    public abstract splicePdf(myBlob: Buffer, from: number, to: number): Promise<Buffer>

    protected _splitPdf = async (myBlob: Buffer): Promise<Buffer[]> => {

        const pdfDoc = await PDFDocument.load(myBlob)
        const numberOfPages = pdfDoc.getPages().length;
        const result: Buffer[] = []
        for (let i = 0; i < numberOfPages; i++) {
            // Create a new "sub" document
            const subDocument = await PDFDocument.create();
            // copy the page at current index
            const [copiedPage] = await subDocument.copyPages(pdfDoc, [i])
            subDocument.addPage(copiedPage);
            const pdfBytes: Buffer = Buffer.from(await subDocument.save())
            result.push(pdfBytes)
            console.log(`file-${i + 1}.pdf`)
            //await writePdfBytesToFile(`out/file-${i + 1}.pdf`, pdfBytes);
        }
        return result
    }

    

    protected _splitPdfInParts = async (myBlob: Buffer, numberOfParts: number): Promise<Buffer[]> => {
        const pdfDoc = await PDFDocument.load(myBlob)
        const numberOfPages = pdfDoc.getPages().length;
        const result: Buffer[] = []
        let markers: number[] = []
        for (let n = 0; n < numberOfParts; n++) {
            markers.push(Math.round((n * numberOfPages) / numberOfParts))
        }
        markers.push(numberOfPages)
        for (let n = 0; n < numberOfParts; n++) {
            // Create a new "sub" document
            const subDocument = await PDFDocument.create();
            for (let i = markers[n]; i < markers[n + 1]; i++) {
                // copy the page at current index
                const [copiedPage] = await subDocument.copyPages(pdfDoc, [i])
                console.log(`page-${i}`)
                subDocument.addPage(copiedPage);
            }
            const pdfBytes: Buffer = Buffer.from(await subDocument.save())
            result.push(pdfBytes)
            console.log(`file-${n}.pdf`)
            //await writePdfBytesToFile(`out/file-${i + 1}.pdf`, pdfBytes);
        }

        return result
    }

    protected _splicePdf = async (myBlob: Buffer, from: number, to: number): Promise<Buffer> => {
        let result: Buffer
        try {
            console.log("SPLICING")
            const pdfDoc = await PDFDocument.load(myBlob)
            const numberOfPages = pdfDoc.getPages().length;
            console.log(numberOfPages)
            const subDocument = await PDFDocument.create();
            console.log(from < 0 ? 0 : from)
            console.log(to > numberOfPages ? numberOfPages : to)
            console.log(from)
            console.log(to)
            const narray = range(from < 0 ? 0 : from, to > numberOfPages ? numberOfPages : to)
            const copiedPages = await subDocument.copyPages(pdfDoc, narray)
            for (const page of copiedPages) {
                subDocument.addPage(page);
            }
            result = Buffer.from(await subDocument.save())
        } catch (err) {
            console.log(err)
        }
        return result
    }
}


export class BlobStorage extends Storage {

    private _blobServiceClient: BlobServiceClient
    private _blobContainerClient: ContainerClient
    private _containerName : string

    constructor(connectionString: string, containerName: string) {
        super()
        this._blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        this._blobContainerClient = this._blobServiceClient.getContainerClient(containerName);
        this._containerName = containerName;
    }

    public toTxt = async (input: BpaServiceObject): Promise<BpaServiceObject> => {
        this._blobContainerClient = this._blobServiceClient.getContainerClient(input.serviceSpecificConfig.containerName);
        const blobClient: BlockBlobClient = this._blobContainerClient.getBlockBlobClient(`${input.filename}.txt`)
        const uploadBlobResponse: BlockBlobUploadResponse = await blobClient.upload(input.data, input.data.length)

        return input
    }

    public getSasUrl = async (accountName: string, containerName: string, accountSharedSecret: string) => {

        //  Creates a client to the BlobService using the connection string.
        const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, new StorageSharedKeyCredential(accountName, accountSharedSecret))
        //  Gets a reference to the container.
        const blobContainerClient = blobServiceClient.getContainerClient(containerName);

        const permissions: ContainerSASPermissions = ContainerSASPermissions.parse("rwl")

        const options: ContainerGenerateSasUrlOptions = {
            permissions: permissions,
            expiresOn: new Date(new Date().valueOf() + (1000 * 60 * 60 * 24))
        }

        let url = await (await blobContainerClient.generateSasUrl(options)).split("?")[1]
        return url
    }

    public getBuffer = async (filename: string): Promise<Buffer> => {
        const blobClient: BlobClient = this._blobContainerClient.getBlobClient(filename)
        return await blobClient.downloadToBuffer()
    }

    public splicePdf = async (myBlob: Buffer, from: number, to: number): Promise<Buffer> => {
        return await this._splicePdf(myBlob, from, to)
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

    public split = async (myBlob: Buffer, filename: string, directoryName: string): Promise<void> => {
        const pages: Buffer[] = await this._splitPdf(myBlob)
        let index = 0
        for (const page of pages) {
            const newFilename = `${filename.replace(".pdf", `_${index}`)}.pdf`
            const blobClient: BlockBlobClient = this._blobContainerClient.getBlockBlobClient(p.join(directoryName, newFilename))
            const uploadBlobResponse: BlockBlobUploadResponse = await blobClient.upload(page, page.length)
            console.log(`uploadResponse : ${JSON.stringify(uploadBlobResponse)}`)
            index++
        }

    }

    public splitPdfInParts = async (myBlob: Buffer, numberOfParts: number): Promise<Buffer[]> => {
        return await this._splitPdfInParts(myBlob, numberOfParts)
    }
}


export class LocalStorage extends Storage {
    private _localPath

    constructor(localPath) {
        super()
        this._localPath = p.normalize(localPath)
    }

    public toTxt = async (input: BpaServiceObject): Promise<BpaServiceObject> => {
        await writeFile(`${input.filename}.txt`, input.data)
        return input
    }


    public splicePdf = async (myBlob: Buffer, from: number, to: number): Promise<Buffer> => {

        return await this._splicePdf(myBlob, 0, 1)


    }

    public split = async (myBlob: Buffer, filename: string, directoryName: string): Promise<void> => {
        const pages: Buffer[] = await this._splitPdf(myBlob)
        let index = 0
        for (const page of pages) {
            const newFilename = `${filename.replace(".pdf", `_${index}`)}.pdf`
            await writeFile(p.join(directoryName, newFilename), page)
            index++
        }
    }



    public getBuffer = async (filename: string): Promise<Buffer> => {
        return readFileSync(p.join(this._localPath, filename))
    }
}