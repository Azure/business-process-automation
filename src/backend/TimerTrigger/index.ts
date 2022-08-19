import { AzureFunction, Context } from "@azure/functions"
import { CosmosDB } from "../services/cosmosdb"
import axios, { AxiosRequestConfig } from "axios"
const _ = require('lodash')

const blobTrigger: AzureFunction = async function (context: Context): Promise<void> {

    const db = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING, process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
    try {
        const transactions = await db.getAsyncTransactions()
        for (const transaction of transactions) {
            const axiosParams: AxiosRequestConfig = {
                headers: {
                    "Content-Type": "application/json",
                    "Ocp-Apim-Subscription-Key": process.env.SPEECH_SUB_KEY
                }
            }
            let status = 'initializing'
            //let result = ""
            const axiosGetResp = await axios.get(transaction.aggregatedResults.stt.location, axiosParams)
            if (axiosGetResp?.data?.status) {
                status = axiosGetResp.data.status
            } else {
                throw new Error(`failed in Speech accessing ${transaction.aggregatedResults.stt.location}`)
            }
            if (status === 'Failed') {
                throw new Error(`batch transcription failed ${transaction.aggregatedResults.stt.filename}`)
            }
            if (status === 'Succeeded' && axiosGetResp?.data?.links?.files) {
                //result = { files: axiosGetResp.data.links.files, stage: "stt" }
                const axiosGetResp2 = await axios.get(axiosGetResp.data.links.files, axiosParams)
                for (const value of axiosGetResp2.data.values) {
                    if (value.kind === 'Transcription') {
                        const axiosGetResp3 = await axios.get(value.links.contentUrl, axiosParams)
                        let result = ""
                        for (const combined of axiosGetResp3.data.combinedRecognizedPhrases) {
                            result += " " + combined.display
                        }
                        let index = transaction.index
                        transaction.aggregatedResults.stt = result
                        transaction.resultsIndexes.push({index : index, name : "speechToText", type : "text"})
                        transaction.type = "text"
                        transaction.index = index + 1
                        transaction.data = result
                        await db.create(transaction)
                        await axios.post(`https://${process.env.BLOB_STORAGE_ACCOUNT_NAME}.azurewebsites.net/api/AsyncCompletion`,JSON.stringify(transaction))
                        break
                    }
                }
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
        context.res = {
            status: 500,
            body: err.message
        }
    }
};

export default blobTrigger;