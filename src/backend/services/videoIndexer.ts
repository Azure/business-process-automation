import { BpaServiceObject } from '../engine/types'
import { BlobServiceClient, ContainerClient, BlockBlobClient, ContainerGenerateSasUrlOptions, ContainerSASPermissions } from "@azure/storage-blob"

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'


export class VideoIndexer {

    private _blobServiceClient: BlobServiceClient
    private _blobContainerClient: ContainerClient

    constructor(connectionString: string, containerName: string) {
        this._blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        this._blobContainerClient = this._blobServiceClient.getContainerClient(containerName);
    }

    private _delay = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public processBatch = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        console.log("kicking off Video Indexer batch.......")

        const options: ContainerGenerateSasUrlOptions = {
            permissions: ContainerSASPermissions.parse("r"),
            expiresOn: new Date(new Date().valueOf() + 86400),
        }
        const filename = input.filename.replace("documents/", "")

        let httpResult = 429
        let axiosResp: AxiosResponse
        while (httpResult === 429) {
            try {
                const blobClient: BlockBlobClient = this._blobContainerClient.getBlockBlobClient(filename) // can throw 429
                const sasUrl = await blobClient.generateSasUrl(options)
                // let payload = {
                //     "contentUrls": [
                //         sasUrl
                //     ],
                //     "properties": {
                //         "wordLevelTimestampsEnabled": true
                //     },
                //     "locale": "en-US",
                //     "displayName": "Transcription of file using default model for en-US"
                // }
                // if (input?.serviceSpecificConfig?.to) {
                //     payload = {
                //         "contentUrls": [
                //             sasUrl
                //         ],
                //         "properties": {
                //             "wordLevelTimestampsEnabled": true
                //         },
                //         "locale": input.serviceSpecificConfig.to,
                //         "displayName": "Transcription of file using default model for en-US"
                //     }
                // }
                // const axiosParams: AxiosRequestConfig = {
                //     headers: {
                //         "Content-Type": "application/json",
                //         "Ocp-Apim-Subscription-Key": process.env.SPEECH_SUB_KEY
                //     }
                // }
                // axiosResp = await axios.post(process.env.SPEECH_SUB_ENDPOINT + 'speechtotext/v3.0/transcriptions', payload, axiosParams)
                // httpResult = axiosResp.status
                httpResult = 200
            } catch (err) {
                if (err.response.status === 429) {
                    httpResult = err.response.status
                    console.log('429')
                    await this._delay(5000)
                } else {
                    throw new Error(err)
                }
            }
        }
        // input.aggregatedResults["videoIndexer"] = {
        //     index: index,
        //     location: axiosResp.headers.location,
        //     stage: "videoIndexer",
        //     filename: input.filename
        // }

        return {
            type: "async transaction",
            label: input.label,
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            aggregatedResults: input.aggregatedResults,
            resultsIndexes: input.resultsIndexes
        }
    }
}
