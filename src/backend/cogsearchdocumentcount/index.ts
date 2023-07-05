import { SearchIndexClient, AzureKeyCredential, SearchClient } from "@azure/search-documents";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    try {
        context.log('HTTP trigger function processed a request. (Get Index)');

        const indexClient = new SearchIndexClient(process.env.COGSEARCH_URL, new AzureKeyCredential(process.env.COGSEARCH_APIKEY));
        const searchClient : SearchClient<unknown> = indexClient.getSearchClient(req.query.indexName)
        const count = await searchClient.getDocumentsCount()
        
        context.res = {
            body: {"count": count}
        }
    } catch (err) {
        context.log(err)
        context.res = {
            body: err
        }
        return
    }
}

export default httpTrigger;
