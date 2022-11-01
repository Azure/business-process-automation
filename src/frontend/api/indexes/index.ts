import { SearchIndexClient, AzureKeyCredential } from "@azure/search-documents";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios, { AxiosRequestConfig } from "axios";


interface Index {
    name : string,
    facetableFields : string[]
    searchableFields : string[]
    collections : string[]
    semanticConfigurations : string[]
}


const getFacetableFields = (fields : any, name : string, result : string[], collections : string[]) => {
    for(const field of fields){
        if(field.facetable === true){
            if(name){
                result.push(`${name}/${field.name}`)
            } else{
                result.push(`${field.name}`)
            }
        }
        if(field.type.includes('Collection(')){
            collections.push(field.name)
        }
        if(field?.fields){
            if(name){
                const _result = getFacetableFields(field.fields, `${name}/${field.name}`, result, collections)
                result = _result.result
            } else{
                const _result = getFacetableFields(field.fields, field.name, result, collections)
                result = _result.result
            }
            
        }
    }

    return { result : result, collections : collections }
}

const getSearchableFields = (fields : any, name : string, result : string[], collections : string[]) => {
    for(const field of fields){
        if(field.searchable === true){
            if(name){
                result.push(`${name}/${field.name}`)
            } else{
                result.push(`${field.name}`)
            }
        }
        if(field.type.includes('Collection(')){
            collections.push(field.name)
        }
        if(field?.fields){
            if(name){
                const _result = getSearchableFields(field.fields, `${name}/${field.name}`, result, collections)
                result = _result.result
            } else{
                const _result = getSearchableFields(field.fields, field.name, result, collections)
                result = _result.result
            }
            
        }
    }

    return { result : result, collections : collections }
}


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    try {
        context.log('HTTP trigger function processed a request. (Get Index)');

        const indexClient = new SearchIndexClient(process.env.COGSEARCH_URL, new AzureKeyCredential(process.env.COGSEARCH_APIKEY));
        const indexesList = indexClient.listIndexes()
        const indexes : Index[] = []

        const axiosOptions : AxiosRequestConfig = {
            headers : {
                "Content-Type" : "application/json",
                "api-key" : process.env.COGSEARCH_APIKEY
            }
        }
        const axiosResult = await axios.get(`${process.env.COGSEARCH_URL}/indexes?api-version=2021-04-30-Preview`, axiosOptions)
        
        for (const index of axiosResult.data.value){
            const facetableFields = getFacetableFields(index.fields, null, [], [])
            const searchableFields = getSearchableFields(index.fields, null, [], [])
            const _index : Index = {
                name : index.name,
                facetableFields : facetableFields.result,
                searchableFields : searchableFields.result,
                collections : facetableFields.collections,
                semanticConfigurations : index?.semantic?.configurations ? index.semantic.configurations : []
            }
            indexes.push(_index)
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
