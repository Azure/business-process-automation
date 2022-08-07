import { SearchIndexClient, SearchIndexerClient, AzureKeyCredential, SearchIndexer, SearchIndexerDataSourceConnection, SearchIndex } from "@azure/search-documents";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    try {
        context.log('HTTP trigger function processed a request.');

        context.res = {
            body: {"foo":"bar"}
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
