import { BpaServiceObject } from "../engine/types"
import axios, { AxiosRequestConfig } from 'axios'
import { BlobServiceClient, ContainerGenerateSasUrlOptions, StorageSharedKeyCredential, ContainerSASPermissions } from "@azure/storage-blob"

export class DocumentTranslation {

    private _storageAccountName: string
    private _storageAccountKey: string
    private _docTranslationEndpoint: string
    private _docTranslationKey: string

    constructor(storageAccountName: string, storageAccountKey: string, docTranslationEndpoint: string, docTranslationKey: string) {
        this._storageAccountName = storageAccountName
        this._storageAccountKey = storageAccountKey
        this._docTranslationEndpoint = docTranslationEndpoint
        this._docTranslationKey = docTranslationKey
    }

    public process = async (input: BpaServiceObject, index : number): Promise<BpaServiceObject> => {

        const filename = input.projectName.replace("documents/","")
        const targetLanguage = input.serviceSpecificConfig.to
        const sourceLanguage = input.serviceSpecificConfig.from

        const translationResult = this.translate(filename, targetLanguage, sourceLanguage)
        input.resultsIndexes.push({index : index, name : "documentTranslation", type : input.type})
        return {
            bpaId : input.bpaId,
            data : input.data,
            label : input.label,
            projectName : input.projectName,
            type : input.type,
            aggregatedResults : input.aggregatedResults,
            resultsIndexes : input.resultsIndexes
        }
    }

    public translate = async (filename: string, targetLanguage: string, sourceLanguage : string) => {

        const sasSourseUrl = await this._getSasUrl(this._storageAccountName, "documents", this._storageAccountKey)
        const sasTargetUrl = await this._getSasUrl(this._storageAccountName, "translated-documents", this._storageAccountKey)
        const parsedFilename = this._parseFilename(filename)
        const inputs = {
            "inputs": [
                {
                    "storageType": "File",
                    "source": {
                        "sourceUrl": `https://${this._storageAccountName}.blob.core.windows.net/documents/${filename}?${sasSourseUrl}`,
                        "language" : sourceLanguage
                    },
                    "targets": [
                        {
                            "targetUrl": `https://${this._storageAccountName}.blob.core.windows.net/translated-documents/${parsedFilename[0]}-${targetLanguage}.${parsedFilename[1]}?${sasTargetUrl}`,
                            "language": targetLanguage
                        }
                    ]
                }
            ]
        }

        let config: AxiosRequestConfig = {
            method: 'post',
            baseURL: `${this._docTranslationEndpoint}translator/text/batch/v1.0`,
            url: "/batches",
            headers: {
                'Ocp-Apim-Subscription-Key': this._docTranslationKey,
                'Content-Type': 'application/json'
            },
            data: inputs
        };

        const result = await axios(config)

        config = {
            method: 'get',
            url: result.headers["operation-location"],
            headers: {
                'Ocp-Apim-Subscription-Key': this._docTranslationKey,
                'Content-Type': 'application/json'
            },
            data: inputs
        };

        return await (await axios(config)).data
    }

    private _getSasUrl = async (accountName: string, containerName: string, accountSharedSecret: string) => {

        //  Creates a client to the BlobService using the connection string.
        const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, new StorageSharedKeyCredential(accountName, accountSharedSecret))
        //  Gets a reference to the container.
        const blobContainerClient = blobServiceClient.getContainerClient(containerName);


        const permissions: ContainerSASPermissions = ContainerSASPermissions.parse("rwl")

        const options: ContainerGenerateSasUrlOptions = {
            permissions: permissions,
            expiresOn: new Date(new Date().valueOf() + 86400)
        }

        let url = null
        try {
            url = await (await blobContainerClient.generateSasUrl(options)).split("?")[1]
            //url = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasUrl}`
            console.log("here")
        } catch (err) {
            console.log(err)
        }

        return url
    }

    private _parseFilename = (filename: string): string[] => {
        const fileSplit = filename.split(".")
        const fileType = fileSplit[fileSplit.length - 1]
        let newFilename = ""
        for (let i = 0; i < fileSplit.length - 1; i++) {
            newFilename += fileSplit[i]
            if (i < fileSplit.length - 2) {
                newFilename += "."
            }
        }
        return [newFilename, fileType]
    }


}