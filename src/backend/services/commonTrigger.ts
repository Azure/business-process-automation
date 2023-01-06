import { Context } from "@azure/functions"
import { BlobStorage, LocalStorage } from "../services/storage"
import { BpaEngine } from "../engine"
//import { CosmosDB } from "../services/cosmosdb";
import { serviceCatalog } from "../engine/serviceCatalog"
import { BpaConfiguration, BpaPipelines } from "../engine/types"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import MessageQueue from "../services/messageQueue";
import { DB } from "./db"
const _ = require('lodash')

export const mqTrigger = async (context: Context, mySbMsg: any, mq: MessageQueue, db : DB) => {
    //context.log('ServiceBus queue trigger function processed message', mySbMsg);
    if (mySbMsg?.type && mySbMsg.type === 'async transaction') {
        console.log('async transaction')
        if (mySbMsg?.aggregatedResults["speechToText"]?.location) {
            const axiosParams: AxiosRequestConfig = {
                headers: {
                    "Content-Type": "application/json",
                    "Ocp-Apim-Subscription-Key": process.env.SPEECH_SUB_KEY
                }
            }
            //const db = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING, process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
            let httpResult = 200
            let axiosGetResp: AxiosResponse

            axiosGetResp = await axios.get(mySbMsg.aggregatedResults["speechToText"].location, axiosParams)
            httpResult = axiosGetResp.status
            if ((axiosGetResp?.data?.status && axiosGetResp.data.status === 'Failed') || (httpResult <= 200 && httpResult >= 299)) {
                mySbMsg.type = 'async failed'
                mySbMsg.data = axiosGetResp.data
                await db.create(mySbMsg)
                throw new Error(`failed : ${JSON.stringify(axiosGetResp.data)}`)
            } else if (axiosGetResp?.data?.status && axiosGetResp.data.status === 'Succeeded' && axiosGetResp?.data?.links?.files) {
                mySbMsg.type = 'async completion'
                let axiosGetResp2: AxiosResponse

                axiosGetResp2 = await axios.get(axiosGetResp.data.links.files, axiosParams)
                httpResult = axiosGetResp2.status
                for (const value of axiosGetResp2.data.values) {
                    if (value.kind === 'Transcription') {
                        const axiosGetResp3 = await axios.get(value.links.contentUrl, axiosParams)
                        let result = ""
                        for (const combined of axiosGetResp3.data.combinedRecognizedPhrases) {
                            result += " " + combined.display
                        }
                        let index = mySbMsg.index
                        mySbMsg.aggregatedResults["speechToText"] = result
                        mySbMsg.resultsIndexes.push({ index: index, name: "speechToText", type: "text" })
                        mySbMsg.type = "text"
                        mySbMsg.index = index + 1
                        mySbMsg.data = result
                        //await db.create(mySbMsg)
                    }
                }
                await mq.sendMessage(mySbMsg)
                
                // const serviceBusClient = new ServiceBusClient(process.env.AzureWebJobsServiceBus);
                // const sender = serviceBusClient.createSender("upload")
                // const messages = [
                //     { body: mySbMsg }
                // ]

                // await sender.sendMessages(messages) // send it in 10s
                // await sender.close();
                // await serviceBusClient.close();
            } else {
                console.log('do nothing')
                await mq.scheduleMessage(mySbMsg, 10000)


                // const serviceBusClient = new ServiceBusClient(process.env.AzureWebJobsServiceBus);
                // const sender = serviceBusClient.createSender("upload")
                // const messages = [
                //     { body: mySbMsg }
                // ]

                // await sender.scheduleMessages(messages, new Date(Date.now() + 10000)) // send it in 10s
                // await sender.close();
                // await serviceBusClient.close();
            }
        }
    }
    else {
        let directoryName = ""
        let filename = ""
        //let fullName = ""
        if(mySbMsg?.filename){
            directoryName = mySbMsg.pipeline
            filename = mySbMsg.fileName
            //fullName = directoryName + '/' + filename
        } else{
            //filename = mySbMsg.subject.split("/")[mySbMsg.subject.split("/").length - 1]
            filename = mySbMsg.subject.split("/documents/blobs/")[1]
            directoryName = filename.split('/')[0]
            //fullName = fullName.replace(directoryName+'/',"")
        
            context.log(`Name of source doc : ${filename}`)
        }
        

        //const db = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING, process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
        
        //const directoryName = context.bindingData.blobTrigger.split('/')[1]
        const config: BpaPipelines = await db.getConfig()
        const bpaConfig: BpaConfiguration = {
            stages: [],
            name: ""
        }

        for (const pipeline of config.pipelines) {
            if (pipeline.name === directoryName) {
                for (const stage of pipeline.stages) {
                    for (const sc of Object.keys(serviceCatalog)) {
                        if (stage.name === serviceCatalog[sc].name) {
                            context.log(`found ${stage.name}`)
                            const newStage = _.cloneDeep(serviceCatalog[sc])
                            newStage.serviceSpecificConfig = stage.serviceSpecificConfig
                            bpaConfig.stages.push({ service: newStage })
                            bpaConfig.name = pipeline.name
                        }
                    }
                }
            }
        }

        if (bpaConfig.stages.length === 0) {
            throw new Error("No Pipeline Found")
        }


        const engine = new BpaEngine()
        let out : any 
        if(mySbMsg?.index){
            out = await engine.processAsync(mySbMsg, mySbMsg.index, bpaConfig, mq)
        } else{
            let blob = null
            if(process.env.USE_LOCAL_STORAGE === 'true'){
                blob = new LocalStorage(process.env.LOCAL_STORAGE_DIR)
            } else{
                blob = new BlobStorage(process.env.AzureWebJobsStorage, process.env.BLOB_STORAGE_CONTAINER)
            }
            const myBuffer = await blob.getBuffer(filename)
            out = await engine.processFile(myBuffer, filename, bpaConfig, mq)
        }
        

        if (out['type'] !== 'async transaction') {
            await db.view(out)
        }

        // context.res = {
        //     status: 200,
        //     body: out
        // }
    }

    context.res = {
        status: 200,
        body: {status : "success"}
    }

}