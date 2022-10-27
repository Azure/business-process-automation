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
            expiresOn: new Date(new Date().valueOf() + (1000 * 60 * 60 * 24)),
        }
        const filename = input.filename.replace("documents/", "")

        let httpResult = 429
        let axiosResp: AxiosResponse
        let axiosRespUpload = null
        while (httpResult === 429) {
            try {
                const blobClient: BlockBlobClient = this._blobContainerClient.getBlockBlobClient(filename)
                const sasUrl = await blobClient.generateSasUrl(options)
                const tokenUrl = `https://api.videoindexer.ai/auth/${process.env.VIDEO_INDEXER_LOCATION}/Accounts?generateAccessTokens=true&allowEdit=true`
                let axiosParams: AxiosRequestConfig = {
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": process.env.VIDEO_INDEXER_APIKEY
                    }
                }

                axiosResp = await axios.get(tokenUrl, axiosParams)
                httpResult = axiosResp.status
                axiosParams = {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
                const postUrl = `https://api.videoindexer.ai/${axiosResp.data[0].location}/Accounts/${axiosResp.data[0].id}/Videos?name=test&videoUrl=${encodeURIComponent(sasUrl)}&accessToken=${axiosResp.data[0].accessToken}`
                axiosRespUpload = await axios.post(postUrl)
                httpResult = axiosResp.status

                

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

        input.aggregatedResults["videoIndexer"] = {
            location: axiosResp.data[0].location,
            account: axiosResp.data[0].id,
            videoId: axiosRespUpload.data.id,
            stage: "videoIndexer",
            filename: input.filename
        }

        return {
            index: index,
            type: "async transaction",
            label: input.label,
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            aggregatedResults: input.aggregatedResults,
            resultsIndexes: input.resultsIndexes
        }
        

        // return {
        //     type: "videoIndexer",
        //     label: input.label,
        //     filename: input.filename,
        //     pipeline: input.pipeline,
        //     bpaId: input.bpaId,
        //     aggregatedResults: input.aggregatedResults,
        //     resultsIndexes: input.resultsIndexes
        // }
    }
}
