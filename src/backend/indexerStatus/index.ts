import { SearchIndexerClient, AzureKeyCredential } from "@azure/search-documents";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    if (req.method === 'GET') {
        try {
            const indexerClient = new SearchIndexerClient(process.env.COGSEARCH_URL, new AzureKeyCredential(process.env.COGSEARCH_APIKEY));
            const status = await indexerClient.getIndexerStatus(req.query.name)

            context.res = {
                body: { "status": status }
            }
        } catch (err) {
            console.log(err)
            context.res = {
                body: { "error": err }
            }
        }

    }

}

export default httpTrigger;
