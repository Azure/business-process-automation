import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosDB } from "../services/db"
import { OpenAI } from "../services/openai"
import { RedisSimilarity } from "../services/redis"
const _ = require('lodash')

const vectorSearchTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const db = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING, process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
    const redis = new RedisSimilarity(process.env.REDIS_URL, process.env.REDIS_PW)
    let results = null
    try {
        await redis.connect()
        const query = req.query["query"]
        const openaiSearchQuery = new OpenAI(process.env.OPENAI_ENDPOINT, process.env.OPENAI_KEY, process.env.OPENAI_DEPLOYMENT_SEARCH_QUERY)
        const openaiText = new OpenAI(process.env.OPENAI_ENDPOINT, process.env.OPENAI_KEY, process.env.OPENAI_DEPLOYMENT_TEXT)
        //get embeddings
        const embeddings = await openaiSearchQuery.getEmbeddings(query)
        results = await redis.query("bpaindex", embeddings.data[0].embedding, '10')
        const topDocument = await db.getByID(results.documents[0].id)
        const prompt = `${topDocument.aggregatedResults.ocrToText} \n \n Q: ${query} \n A:` 
        const oaiAnswer = await openaiText.generic(prompt, 200)
        //openaiText.processGeneric()
        context.res = {
            status: 200,
            body: {
                documents: results.documents,
                topDocument: topDocument,
                oaiAnswer: oaiAnswer
            }
        }
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