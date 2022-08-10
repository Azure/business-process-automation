import { SearchIndexClient, AzureKeyCredential } from "@azure/search-documents";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    try {
        context.log('HTTP trigger function processed a request.');


        const indexClient = new SearchIndexClient(process.env.COGSEARCH_URL, new AzureKeyCredential(process.env.COGSEARCH_APIKEY));
        const indexesList = indexClient.listIndexes()
        const indexes = []
        for await (const index of indexesList){
            indexes.push(index.name)
        }

        context.res = {
            body: {"indexes": indexes}
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
