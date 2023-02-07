import { Context } from "@azure/functions"
import { BlobStorage, LocalStorage } from "../services/storage"
import { BpaEngine } from "."
import { serviceCatalog } from "./serviceCatalog"
import { BpaConfiguration, BpaPipelines } from "./types"
import MessageQueue from "../services/messageQueue";
import { DB } from "../services/db"
import { Speech } from "../services/speech"
import { FormRec } from "../services/formrec"
import { LanguageStudio } from "../services/language"
const _ = require('lodash')
import { RedisSimilarity } from "../services/redis";

let redis : RedisSimilarity

if(process.env.STORE_IN_REDIS === 'true'){
    redis = new RedisSimilarity(process.env.REDIS_URL,process.env.REDIS_PW)
    redis.connect().then((c)=>{
        try{
            // redis.flushall().then(r => {
                redis.createIndex("bpaindex", 4096).then((idx)=>{
                    console.log('created new index')
                })
            //})
        } catch(err){
            console.log(err)
        }
    })
}

export const mqTrigger = async (context: Context, mySbMsg: any, mq: MessageQueue, db: DB) => {
    if (mySbMsg?.type && mySbMsg.type === 'async transaction') {
        console.log('async transaction')
        if (mySbMsg?.aggregatedResults["speechToText"]?.location) {
            const speech = new Speech(process.env.SPEECH_SUB_KEY, process.env.SPEECH_SUB_REGION, process.env.AzureWebJobsStorage, process.env.BLOB_STORAGE_CONTAINER, process.env.COSMOSDB_CONNECTION_STRING, process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME);
            await speech.processAsync(mySbMsg, db, mq)
        } else if (mySbMsg?.aggregatedResults["generalDocument"]?.location ||
            mySbMsg?.aggregatedResults["layout"]?.location ||
            mySbMsg?.aggregatedResults["invoice"]?.location ||
            mySbMsg?.aggregatedResults["businessCard"]?.location ||
            mySbMsg?.aggregatedResults["identity"]?.location ||
            mySbMsg?.aggregatedResults["receipt"]?.location ||
            mySbMsg?.aggregatedResults["taxw2"]?.location ||
            mySbMsg?.aggregatedResults["customFormRec"]?.location ||
            mySbMsg?.aggregatedResults["ocrContainer"]?.location ||
            mySbMsg?.aggregatedResults["ocr"]?.location) {
            const fr = new FormRec(process.env.FORMREC_ENDPOINT, process.env.FORMREC_APIKEY)
            await fr.processAsync(mySbMsg, db, mq)
        }
        else if (mySbMsg?.aggregatedResults["extractSummary"]?.location ||
            mySbMsg?.aggregatedResults["analyzeSentiment"]?.location ||
            mySbMsg?.aggregatedResults["extractKeyPhrases"]?.location ||
            mySbMsg?.aggregatedResults["multiCategoryClassify"]?.location ||
            mySbMsg?.aggregatedResults["recognizeCustomEntities"]?.location ||
            mySbMsg?.aggregatedResults["recognizeEntities"]?.location ||
            mySbMsg?.aggregatedResults["recognizeLinkedEntities"]?.location ||
            mySbMsg?.aggregatedResults["recognizePiiEntities"]?.location ||
            mySbMsg?.aggregatedResults["healthCare"]?.location ||
            mySbMsg?.aggregatedResults["singleCategoryClassify"]?.location) {
            const language = new LanguageStudio(process.env.LANGUAGE_STUDIO_PREBUILT_ENDPOINT, process.env.LANGUAGE_STUDIO_PREBUILT_APIKEY)
            await language.processAsync(mySbMsg, db, mq)
        } else {
            throw new Error("async transaction not recognized" + mySbMsg.filename)
        }
    }
    else {
        if(mySbMsg.dbId){
            await db.deleteByID(mySbMsg.dbId)
            delete mySbMsg.dbId
        }
        
        let directoryName = ""
        let filename = ""
        if (mySbMsg?.filename) {
            directoryName = mySbMsg.pipeline
            filename = mySbMsg.fileName
        } else {
            filename = mySbMsg.subject.split("/documents/blobs/")[1]
            directoryName = filename.split('/')[0]

            context.log(`Name of source doc : ${filename}`)
        }

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
        let out: any
        if (mySbMsg?.index) {
            out = await engine.processAsync(mySbMsg, mySbMsg.index, bpaConfig, mq, db)
        } else {
            let blob = null
            if (process.env.USE_LOCAL_STORAGE === 'true') {
                blob = new LocalStorage(process.env.LOCAL_STORAGE_DIR)
            } else {
                blob = new BlobStorage(process.env.AzureWebJobsStorage, process.env.BLOB_STORAGE_CONTAINER)
            }
            const myBuffer = await blob.getBuffer(filename)
            out = await engine.processFile(myBuffer, filename, bpaConfig, mq, db)
        }



        if (out['type'] !== 'async transaction') {
            const newObject = await db.view(out)
            if(newObject?.id && (process.env.STORE_IN_REDIS === 'true') && newObject?.aggregatedResults?.openaiEmbeddings){
                await redis.set(newObject.id, newObject, newObject.aggregatedResults.openaiEmbeddings.data[0].embedding)
            }

            
        }
    }

    context.res = {
        status: 200,
        body: { status: "success" }
    }

}