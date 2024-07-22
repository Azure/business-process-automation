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

let redis: RedisSimilarity

if (process.env.STORE_IN_REDIS === 'true') {
    redis = new RedisSimilarity(process.env.REDIS_URL, process.env.REDIS_PW)
    redis.connect().then((c) => {
        try {
            // redis.flushall().then(r => {
            redis.createIndex("bpaindexfilterada", 1024).then((idx) => {
                console.log('created new index')
            })
            //})
        } catch (err) {
            console.log(err)
        }
    })
}

const processAsyncRequests = async (mySbMsg, db, mq) => {
    console.log('async transaction')
    if (mySbMsg?.aggregatedResults["speechToText"]?.location) {
        const speech = new Speech(process.env.SPEECH_SUB_KEY, process.env.SPEECH_SUB_REGION, process.env.AzureWebJobsStorage, process.env.BLOB_STORAGE_CONTAINER);
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
        const blob = new BlobStorage(process.env.AzureWebJobsStorage, process.env.BLOB_STORAGE_CONTAINER)
        const fr = new FormRec(process.env.FORMREC_ENDPOINT, process.env.FORMREC_APIKEY, blob)
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

const getFileDirNames = (mySbMsg) => {
    let directoryName = ""
    let filename = ""
    if (mySbMsg?.filename) {
        directoryName = mySbMsg.pipeline
        filename = mySbMsg.fileName
    } else {
        filename = mySbMsg.subject.split("/documents/blobs/")[1]
        directoryName = filename.split('/')[0]
    }
    return { filename: filename, directoryName: directoryName }
}

const getStages = async (mySbMsg, context, db) => {

    const { filename, directoryName } = getFileDirNames(mySbMsg)

    const config: BpaPipelines = await db.getConfig()
    const bpaConfig: BpaConfiguration = {
        stages: [],
        name: ""
    }

    let found = false
    for (const pipeline of config.pipelines) {
        if (pipeline.name === directoryName) {
            found = true
            bpaConfig.name = pipeline.name
            for (const stage of pipeline.stages) {
                for (const sc of Object.keys(serviceCatalog)) {
                    if (stage.name === serviceCatalog[sc].name) {
                        context.log(`found ${stage.name}`)
                        const newStage = _.cloneDeep(serviceCatalog[sc])
                        newStage.serviceSpecificConfig = stage.serviceSpecificConfig
                        bpaConfig.stages.push({ service: newStage })
                    }
                }
            }
        }
    }

    if (!found) {
        throw new Error("No Pipeline Found")
    }

    return {
        bpaConfig: bpaConfig,
        filename: filename
    }
}

const pushToRedis = async (out, db) => {
    delete out.data
    const newObject = await db.create(out)
    if (newObject?.id && (process.env.STORE_IN_REDIS === 'true') && newObject?.aggregatedResults?.openaiEmbeddings) {
        await redis.set(newObject.id, newObject, newObject.aggregatedResults.openaiEmbeddings.data[0].embedding)
    }
}

const processSyncRequests = async (mySbMsg, stages, mq, db) => {
    const engine = new BpaEngine()
    let out: any
    if (mySbMsg?.index) {
        out = await engine.processAsync(mySbMsg, mySbMsg.index, stages.bpaConfig, mq, db)
    } else {
        let blob = null
        if (process.env.USE_LOCAL_STORAGE === 'true') {
            blob = new LocalStorage(process.env.LOCAL_STORAGE_DIR)
        } else {
            blob = new BlobStorage(process.env.AzureWebJobsStorage, process.env.BLOB_STORAGE_CONTAINER)
        }
        const myBuffer = await blob.getBuffer(stages.filename)
        out = await engine.processFile(blob, myBuffer, stages.filename, stages.bpaConfig, mq, db)
    }

    return out
}

export const mqTrigger = async (context: Context, mySbMsg: any, mq: MessageQueue, db: DB) => {

    if (mySbMsg?.type && mySbMsg.type === 'async transaction') {
        await processAsyncRequests(mySbMsg, db, mq)
    }
    else {
        const stages = await getStages(mySbMsg, context, db)
        const out = await processSyncRequests(mySbMsg, stages, mq, db)

        if (out['type'] !== 'async transaction') { /// Case where embeddings are pushed to redis
            await pushToRedis(out, db)
        }
    }

    context.res = {
        status: 200,
        body: { status: "success" }
    }
}