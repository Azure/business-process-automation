//import { SearchIndexClient, SearchOptions, AzureKeyCredential, SearchIndexer, SearchIndexerDataSourceConnection, SearchIndex } from "@azure/search-documents";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios, { AxiosRequestConfig } from 'axios'

interface SemanticResult {
    answers: []
    values: []
}

const constructFilter = (filters : any[]) => {
    let filterString = ""
    let index = 0
    for(const filter of filters){
        if(index === 0){
            const split = filter["field"].split('/')
            filterString += `${split[0]}/any(${split[0]}:${split[0]}/${split[split.length-1]} eq ${filter["value"]})`

        }
        // } else {
        //     filterString += ` and ${filter["field"]} eq '${filter["value"]}'`
        // }
        index++
    }
    return filterString
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    try {
        context.log('HTTP trigger function processed a request.');

        const index = req.body.index

        const headers: AxiosRequestConfig = {
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.COGSEARCH_APIKEY
            }
        }
        const body = {
            search: req.body.q,
            count: true,
            facets: req?.body?.facets ? req.body.facets : [],
            filter: req?.body?.facets ? constructFilter(req.body.filters) : "",
            queryType: req?.body?.useSemanticSearch == true ? "semantic" : "simple",
            skip: req.body.skip,
            top: req.body.top,
            semanticConfiguration : req.body.semanticConfig,
            queryLanguage : req.body.queryLanguage
        }
        if(index){
            let url = `${process.env.COGSEARCH_URL}/indexes/${index}/docs/search?api-version=2021-04-30-Preview`
            const axiosResult = await axios.post(url, body, headers)
            // let url = `${process.env.COGSEARCH_URL}/indexes/${index}/docs?api-version=2021-04-30-Preview&search=${encodeURIComponent(text)}&queryLanguage=en-US&queryType=semantic&captions=extractive&answers=extractive%7Ccount-3&semanticConfiguration=${semanticConfig}`
            // if(semantic === 'false'){
            //     url = `${process.env.COGSEARCH_URL}/indexes/${index}/docs?api-version=2021-04-30-Preview&facet=label&search=${encodeURIComponent(text)}&queryLanguage=en-US`
            // }
            //const axiosResult = await axios.get(url,headers)
    
            context.res = {
                body: { "results": axiosResult.data }
            }
        } else {
            context.res = {
                body: { "results": [] }
            }
        }

    } catch (err) {
        context.log(err)
        context.res = {
            body: err
        }
    }
    return
}

export default httpTrigger;
