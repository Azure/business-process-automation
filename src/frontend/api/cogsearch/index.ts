import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CognitiveSearch } from "../cogsearch"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        const pipeline = context.req.query.pipeline
        if(req.query.vector==="true"){
            const cogSearch: CognitiveSearch = new CognitiveSearch(process.env.COGSEARCH_URL, process.env.COGSEARCH_APIKEY)
            const indexer = await cogSearch.createVector(pipeline)
            context.res = {
                body: { "indexer": indexer }
            }
        } else{
            const cogSearch: CognitiveSearch = new CognitiveSearch(process.env.COGSEARCH_URL, process.env.COGSEARCH_APIKEY)
            const indexer = await cogSearch.create(pipeline)
            context.res = {
                body: { "indexer": indexer }
            }
        }
       
    } catch (err) {
        console.log(err)
    }

}

export default httpTrigger;
