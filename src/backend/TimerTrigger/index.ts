import { AzureFunction, Context } from "@azure/functions"
import { CosmosDB } from "../services/cosmosdb"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
const _ = require('lodash')

const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const timerTrigger: AzureFunction = async function (context: Context): Promise<void> {

    const db = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING, process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
    try {
        const transactions = await db.getUnlockedAsyncTransactions()
        for (let transaction of transactions) {
            transaction.type = 'async locked'
            transaction = await db.create(transaction)
        }
        for (const transaction of transactions) {
            try {
                let axiosParams: AxiosRequestConfig = {
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": process.env.SPEECH_SUB_KEY
                    }
                }
                if (transaction?.aggregatedResults["videoIndexer"]?.location) {
                    const tokenVideoUrl = `https://api.videoindexer.ai/auth/${transaction.aggregatedResults.videoIndexer.location}/Accounts/${transaction.aggregatedResults.videoIndexer.account}/Videos/${transaction.aggregatedResults.videoIndexer.videoId}/AccessToken?allowEdit=true`
                    axiosParams = {
                        headers: {
                            "Content-Type": "application/json",
                            "Ocp-Apim-Subscription-Key": process.env.VIDEO_INDEXER_APIKEY
                        }
                    }

                    const tokenVideoAxiosResp = await axios.get(tokenVideoUrl, axiosParams)
                    const tokenVideoGetUrl = `https://api.videoindexer.ai/${transaction.aggregatedResults.videoIndexer.location}/Accounts/${transaction.aggregatedResults.videoIndexer.account}/Videos/${transaction.aggregatedResults.videoIndexer.videoId}/Index?accessToken=${tokenVideoAxiosResp.data}&language=English`

                    const tokenVideoGetAxiosResp = await axios.get(tokenVideoGetUrl, axiosParams)
                    const state = tokenVideoGetAxiosResp.data.state
                    console.log(tokenVideoGetAxiosResp.data.state)
                    if (state !== 'Processing') {
                        let index = transaction.index
                        transaction.aggregatedResults["videoIndexer"] = tokenVideoGetAxiosResp.data
                        transaction.resultsIndexes.push({ index: index, name: "videoIndexer", type: "videoIndexer" })
                        transaction.type = "videoIndexer"
                        transaction.index = index + 1
                        transaction.data = tokenVideoGetAxiosResp.data
                        await db.create(transaction)
                        if (process.env.DEV === 'true') {
                            axios.post(`http://localhost:7071/api/AsyncCompletion`, JSON.stringify(transaction))
                        } else {
                            axios.post(`https://${process.env.BLOB_STORAGE_ACCOUNT_NAME}.azurewebsites.net/api/AsyncCompletion`, JSON.stringify(transaction))
                        }
                    }

                }
                if (transaction?.aggregatedResults["speechToText"]?.location) {
                    let httpResult = 429
                    let axiosGetResp: AxiosResponse
                    try {
                        axiosGetResp = await axios.get(transaction.aggregatedResults["speechToText"].location, axiosParams)
                        httpResult = axiosGetResp.status
                    } catch (err) {
                        if (err?.response?.status && err.response.status === 429) {
                            console.log('429.5')
                        }
                        transaction.type = 'async transaction'
                        await db.create(transaction)
                    }
                    if (axiosGetResp?.data?.status && axiosGetResp.data.status === 'Failed') {
                        transaction.type = 'async failed'
                        transaction.data = axiosGetResp.data
                        await db.create(transaction)
                    }
                    else if (axiosGetResp?.data?.status && axiosGetResp.data.status === 'Succeeded' && axiosGetResp?.data?.links?.files) {
                        transaction.type = 'async completion'
                        await db.create(transaction)
                        let axiosGetResp2: AxiosResponse
                        try {
                            axiosGetResp2 = await axios.get(axiosGetResp.data.links.files, axiosParams)
                            httpResult = axiosGetResp2.status
                            for (const value of axiosGetResp2.data.values) {
                                if (value.kind === 'Transcription') {
                                    const axiosGetResp3 = await axios.get(value.links.contentUrl, axiosParams)
                                    let result = ""
                                    for (const combined of axiosGetResp3.data.combinedRecognizedPhrases) {
                                        result += " " + combined.display
                                    }
                                    let index = transaction.index
                                    transaction.aggregatedResults["speechToText"] = result
                                    transaction.resultsIndexes.push({ index: index, name: "speechToText", type: "text" })
                                    transaction.type = "text"
                                    transaction.index = index + 1
                                    transaction.data = result
                                    await db.create(transaction)
                                    if (process.env.DEV === 'true') {
                                        axios.post(`http://localhost:7071/api/AsyncCompletion`, JSON.stringify(transaction))
                                    } else {
                                        axios.post(`https://${process.env.BLOB_STORAGE_ACCOUNT_NAME}.azurewebsites.net/api/AsyncCompletion`, JSON.stringify(transaction))
                                    }

                                    break
                                }
                            }
                        } catch (err) {
                            if (err?.response?.status && err.response.status === 429) {
                                console.log('429.5')
                            }
                            transaction.type = 'async transaction'
                            await db.create(transaction)
                        }
                    } else {
                        transaction.type = 'async transaction'
                        await db.create(transaction)
                    }
                } else {
                    transaction.type = 'async transaction'
                    await db.create(transaction)
                }

            } catch (err) {
                context.log(err)
                transaction.type = 'async transaction'
                await db.create(transaction)
                // await db.view({
                //     data: err.message,
                //     type: "error",
                //     label: "Timer Trigger",
                //     filename: "async transaction",
                //     pipeline: "error",
                //     bpaId: "error",
                //     aggregatedResults: {},
                //     resultsIndexes: null
                // })
            }
        }
    }
    catch (err) {
        context.log(err)
        await db.view({
            data: err.message,
            type: "error",
            label: "error",
            filename: "async transaction",
            pipeline: "error",
            bpaId: "error",
            aggregatedResults: {},
            resultsIndexes: null
        })
    }
};

export default timerTrigger;