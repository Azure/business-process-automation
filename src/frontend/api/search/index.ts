import { SearchIndexClient, SearchOptions, AzureKeyCredential, SearchIndexer, SearchIndexerDataSourceConnection, SearchIndex } from "@azure/search-documents";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios, { AxiosRequestConfig } from 'axios'

interface SemanticResult {
    answers : []
    values : []
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    try {
        context.log('HTTP trigger function processed a request.');
        if(req?.query?.index && req?.query?.text){
            const index = req.query["index"]
            const text = req.query["text"]
            const semantic = req.query["semantic"]
            const semanticConfig = req.query["semanticConfig"]
    
            const headers : AxiosRequestConfig = {
                headers : {
                    "Content-Type" : "application/json",
                    "api-key" : process.env.COGSEARCH_APIKEY
                }
            }
            let url = `${process.env.COGSEARCH_URL}indexes/${index}/docs?api-version=2021-04-30-Preview&search=${encodeURIComponent(text)}&queryLanguage=en-US&queryType=semantic&captions=extractive&answers=extractive%7Ccount-3&semanticConfiguration=${semanticConfig}`
            if(semantic === 'false'){
                url = `${process.env.COGSEARCH_URL}indexes/${index}/docs?api-version=2021-04-30-Preview&search=${encodeURIComponent(text)}&queryLanguage=en-US`
            }
            const axiosResult = await axios.get(url,headers)

            context.res = {
                body: {"results": axiosResult.data}
            }
        } else {
            context.res = {
                body: "error"
            }
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
