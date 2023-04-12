import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobDB } from "../services/db"
import { OpenAI } from "../services/openai"
import { RedisSimilarity } from "../services/redis"
const _ = require('lodash')

const vectorSearchTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    console.log("############################################################################################################")
    const db = new BlobDB(process.env.AzureWebJobsStorage,"db", process.env.BLOB_STORAGE_CONTAINER)
    const redis = new RedisSimilarity(process.env.REDIS_URL, process.env.REDIS_PW)
    let results = null
    try {
        console.log("############################################# CONNECT ###############################################################")
        await redis.connect()
        const query = req.query.query
        const pipeline = req.query.pipeline
        const openaiSearchQuery = new OpenAI(process.env.OPENAI_ENDPOINT, process.env.OPENAI_KEY, process.env.OPENAI_DEPLOYMENT_SEARCH_QUERY)
        const openaiText = new OpenAI(process.env.OPENAI_ENDPOINT, process.env.OPENAI_KEY, process.env.OPENAI_DEPLOYMENT_TEXT)
        //get embeddings
        const embeddings = await openaiSearchQuery.getEmbeddings(query)
        console.log("############################################# GET EMBEDDINGS ###############################################################")
        console.log(JSON.stringify(embeddings).substring(0,100))
        results = await redis.query("bpaindexfiltercurie2", embeddings.data[0].embedding, '10', pipeline)
        console.log(JSON.stringify(results))
        if (results.documents.length > 0) {
            console.log("############################################# GET BY ID ###############################################################")
            const topDocument = await db.getByID(results.documents[0].id, pipeline)
            console.log(JSON.stringify(topDocument).substring(0,100))
            let prompt = ""
            if(topDocument?.aggregatedResults?.ocrToText){
                console.log("############################################# TOP DOC ###############################################################")
                prompt = `${topDocument.aggregatedResults.ocrToText.slice(0,3500)} \n \n Q: ${query} \n A:`
            } else if(topDocument?.aggregatedResults?.speechToText){
                prompt = `${topDocument.aggregatedResults.speechToText.slice(0,3500)} \n \n Q: ${query} \n A:`
            }
            const oaiAnswer = await openaiText.generic(prompt, 200)
            console.log(JSON.stringify(results.documents))
            console.log("############################################# LOGS ###############################################################")
            console.log(JSON.stringify(topDocument))
            context.res = {
                status: 200,
                body: {
                    documents: results.documents,
                    topDocument: topDocument,
                    oaiAnswer: oaiAnswer
                }
            }
        } else {
            context.res = {
                status: 200,
                body: {
                    documents: [],
                    topDocument: null,
                    oaiAnswer: null
                }
            }
        }

        //openaiText.processGeneric()

    } catch (err) {
        context.log(err)
        context.res = {
            status: 500,
            body: err.message
        }
    } finally {
        await redis.disconnect()
    }

    return results
};

export default vectorSearchTrigger;