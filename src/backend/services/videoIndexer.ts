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
                const axiosRespUpload = await axios.post(postUrl)
                httpResult = axiosResp.status

                const tokenVideoUrl = `https://api.videoindexer.ai/auth/${axiosResp.data[0].location}/Accounts/${axiosResp.data[0].id}/Videos/${axiosRespUpload.data.id}/AccessToken?allowEdit=true`
                axiosParams = {
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": process.env.VIDEO_INDEXER_APIKEY
                    }
                }

        

                const tokenVideoAxiosResp = await axios.get(tokenVideoUrl, axiosParams)
                httpResult = axiosResp.status

                        ///Index?accessToken={videoAccessToken}&language=English

                let state = 'Processing'
                while(state === 'Processing'){
                    const tokenVideoGetUrl = `https://api.videoindexer.ai/${axiosResp.data[0].location}/Accounts/${axiosResp.data[0].id}/Videos/${axiosRespUpload.data.id}/Index?accessToken=${tokenVideoAxiosResp.data}&language=English`

                    const tokenVideoGetAxiosResp = await axios.get(tokenVideoGetUrl, axiosParams)
                    state = tokenVideoGetAxiosResp.data.state
                    httpResult = axiosResp.status
                    console.log(tokenVideoGetAxiosResp.data.state)
                    await this._delay(2000)
                    if(state !== 'Processing'){
                        console.log('done')
                    }
                }

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
