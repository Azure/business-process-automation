import { BpaServiceObject } from '../engine/types'
import { BlobServiceClient, ContainerClient, BlockBlobClient, ContainerGenerateSasUrlOptions, ContainerSASPermissions } from "@azure/storage-blob"

import axios, { AxiosRequestConfig, AxiosResponse } from "axios"


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

    public processAsync = async (transaction): Promise<void> => {
        // const axiosParams = {
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Ocp-Apim-Subscription-Key": process.env.VIDEO_INDEXER_APIKEY
        //     }
        // }
        // const tokenVideoUrl = `https://api.videoindexer.ai/auth/${transaction.aggregatedResults.videoIndexer.location}/Accounts/${transaction.aggregatedResults.videoIndexer.account}/Videos/${transaction.aggregatedResults.videoIndexer.videoId}/AccessToken?allowEdit=true`
        // const tokenVideoAxiosResp = await axios.get(tokenVideoUrl, axiosParams)


        // const tokenVideoGetUrl = `https://api.videoindexer.ai/${transaction.aggregatedResults.videoIndexer.location}/Accounts/${transaction.aggregatedResults.videoIndexer.account}/Videos/${transaction.aggregatedResults.videoIndexer.videoId}/Index?accessToken=${tokenVideoAxiosResp.data}&language=English`
        // const tokenVideoGetAxiosResp = await axios.get(tokenVideoGetUrl, axiosParams)
        // const state = tokenVideoGetAxiosResp.data.state
        // console.log(tokenVideoGetAxiosResp.data.state)
        // if (state != 'Processing') {
        //     transaction.type = 'async completion'
        //     await db.create(transaction)
        //     transaction.resultsIndexes.push({ index: transaction.index, name: "videoIndexer", type: 'video' })
        //     transaction.aggregatedResults["videoIndexer"] = tokenVideoGetAxiosResp.data
        //     let index = transaction.index
        //     transaction.type = "videoIndexer"
        //     transaction.index = index + 1
        //     transaction.data = tokenVideoGetAxiosResp.data
        //     await db.create(transaction)
        //     if (process.env.DEV === 'true') {
        //         axios.post(`http://localhost:7071/api/AsyncCompletion`, JSON.stringify(transaction))
        //     } else {
        //         axios.post(`https://${process.env.BLOB_STORAGE_ACCOUNT_NAME}.azurewebsites.net/api/AsyncCompletion`, JSON.stringify(transaction))
        //     }
        // } else {
        //     transaction.type = 'async transaction'
        //     await db.create(transaction)
        // }
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
            resultsIndexes: input.resultsIndexes,
            id: input.id
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
