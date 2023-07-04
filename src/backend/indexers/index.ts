import { SearchIndexerClient, AzureKeyCredential } from "@azure/search-documents";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios, { AxiosRequestConfig } from "axios";

interface Indexer {
    name : string,
    targetIndexName : string
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    if(req.method === 'GET'){
        try {
            context.log('HTTP trigger function processed a request. (Get Index)');
    
            const indexers : Indexer[] = []
    
            const axiosOptions : AxiosRequestConfig = {
                headers : {
                    "Content-Type" : "application/json",
                    "api-key" : process.env.COGSEARCH_APIKEY
                }
            }
            const axiosResult = await axios.get(`${process.env.COGSEARCH_URL}/indexers?api-version=2021-04-30-Preview`, axiosOptions)
            
            for (const indexer of axiosResult.data.value){
                const _index : Indexer = {
                    name : indexer.name,
                    targetIndexName : indexer.targetIndexName
                }
                indexers.push(_index)
            }
    
            context.res = {
                body: {"indexers": indexers}
            }
        } catch (err) {
            context.log(err)
            context.res = {
                body: err
            }
            return
        }
    } else {
        try{
            const axiosOptions : AxiosRequestConfig = {
                headers : {
                    "Content-Type" : "application/json",
                    "api-key" : process.env.COGSEARCH_APIKEY
                }
            }
            const indexerName = req.query.name
            const axiosResult = await axios.post(`${process.env.COGSEARCH_URL}/indexers/${indexerName}/run?api-version=2021-04-30-Preview`,{}, axiosOptions)
               
            context.res = {
                body : axiosResult
            }
        } catch(err){
            console.log(err)
        }
        
    }

}

export default httpTrigger;
