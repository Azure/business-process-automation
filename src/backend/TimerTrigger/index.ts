import { AzureFunction, Context } from "@azure/functions"
import { CosmosDB } from "../services/cosmosdb"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
const _ = require('lodash')

const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const blobTrigger: AzureFunction = async function (context: Context): Promise<void> {

    const db = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING, process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
    context.res = {
        status: 200,
        body: {}
    }
    try {
        const transactions = await db.getAsyncTransactions()
        for (const transaction of transactions.slice(0,transactions.length > 100 ? 100 : transactions.length)) { //take at most the top 100 items
            try {
                const axiosParams: AxiosRequestConfig = {
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": process.env.SPEECH_SUB_KEY
                    }
                }
                if (transaction?.aggregatedResults["speechToText"]?.location) {
                    let httpResult = 429

                    let axiosGetResp: AxiosResponse
                    while (httpResult === 429) {
                        try {
                            axiosGetResp = await axios.get(transaction.aggregatedResults["speechToText"].location, axiosParams)
                            httpResult = axiosGetResp.status
                        } catch (err) {
                            if (err?.response?.status && err.response.status === 429) {
                                httpResult = err.response.status
                                console.log('429.5')
                                await delay(5000)
                            } else {
                                throw new Error(err)
                            }
                        }

                    }

                    if (axiosGetResp?.data?.status && axiosGetResp.data.status === 'Succeeded' && axiosGetResp?.data?.links?.files) {
                        transaction.type = 'async completion'
                        await db.create(transaction)
                        let axiosGetResp2: AxiosResponse
                        httpResult = 429
                        while (httpResult == 429) {
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
                                    httpResult = err.response.status
                                    console.log('429.5')
                                    await delay(5000)
                                } else {
                                    throw new Error(err)
                                }
                            }
                        }
                    }
                }

            } catch (err) {
                context.log(err)
                await db.view({
                    data: err.message,
                    type: "error",
                    label: "Timer Trigger",
                    filename: "async transaction",
                    pipeline: "error",
                    bpaId: "error",
                    aggregatedResults: {},
                    resultsIndexes: null
                })
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

export default blobTrigger;