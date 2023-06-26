//import { SearchIndexClient, AzureKeyCredential } from "@azure/search-documents";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios, { AxiosRequestConfig } from "axios";


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    try {
        const isDeployed = (process.env.OPENAI_ENDPOINT) ? true : false
        context.res = {
            body : {
                isDeployed: isDeployed
            }
        }
    } catch (err) {
        context.log(err)
        context.res = {
            status: err
        }
        return
    }
}


export default httpTrigger;
