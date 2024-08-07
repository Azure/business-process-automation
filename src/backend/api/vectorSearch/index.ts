import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobDB } from "../services/db"
import { OpenAI } from "../services/openai"
import { RedisSimilarity } from "../services/redis"
const _ = require('lodash')

const vectorSearchTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const db = new BlobDB(process.env.AzureWebJobsStorage,"db", process.env.BLOB_STORAGE_CONTAINER)
    const redis = new RedisSimilarity(process.env.REDIS_URL, process.env.REDIS_PW)
    let results = null
    try {
        await redis.connect()
        const query = req.query.query
        const pipeline = req.query.pipeline
        const openaiSearchQuery = new OpenAI(process.env.OPENAI_ENDPOINT, process.env.OPENAI_KEY, process.env.OPENAI_DEPLOYMENT_SEARCH_QUERY)
        const openaiText = new OpenAI(process.env.OPENAI_ENDPOINT, process.env.OPENAI_KEY, process.env.OPENAI_DEPLOYMENT_TEXT)
        //get embeddings
        const embeddings = await openaiSearchQuery.getEmbeddings(query)
        results = await redis.query("bpaindexfilterada", embeddings.data[0].embedding, '10', pipeline)
        if (results.documents.length > 0) {
            const topDocument = await db.getByID(results.documents[0].id, pipeline)
            let prompt = "Answer the question using only the text coming after the <TEXT> field.  Keep the answers short and to the point.  If the answer does not exist within the text, say 'I don't know'. \n "
            if(topDocument?.aggregatedResults?.ocrToText){
                prompt += `${query}\n <TEXT> ${topDocument.aggregatedResults.ocrToText.slice(0,3500)} \n \n `
            } else if(topDocument?.aggregatedResults?.speechToText){
                prompt += `${query}\n <TEXT> ${topDocument.aggregatedResults.speechToText.slice(0,3500)} \n \n `
            } else if(topDocument?.aggregatedResults?.text){
                prompt += `${query}\n <TEXT> ${topDocument.aggregatedResults.text.slice(0,3500)} \n \n `
            }
            const oaiAnswer = await openaiText.generic(prompt, 200)
            context.res = {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: {
                    documents: results.documents,
                    topDocument: topDocument,
                    oaiAnswer: oaiAnswer
                }
            }
        } else {
            context.res = {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: {
                    documents: [],
                    topDocument: null,
                    oaiAnswer: null
                }
            }
        }

    } catch (err) {
        context.log(err)
        
        context.res = {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
            body: err.message
        }
    } finally {
        await redis.disconnect()
    }

    return results
};

export default vectorSearchTrigger;