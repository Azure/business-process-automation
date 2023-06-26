import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios, { AxiosRequestConfig } from 'axios'

const nextLetter = (index: number) => {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
    return letters[index]
}

const containsCollections = (filters, collections) => {
    let out = false
    for (const filter of filters) {
        for (const collection of collections) {
            if (filter.field.split('/').includes(collection)) {
                out = true
                break
            }
        }

    }

    return out
}

const constructFilter = (filters: string[], collections: string[]) => {
    let filterStrings = []

    for (const filter of filters) {
        let filterString = ""
        if (containsCollections([filter], collections)) {
            const splitFields = filter["field"].split('/')
            let splitIndex = 0
            let tempCollection = false
            let collectionIndex = 0
            for (const s of splitFields) {
                const first = (splitIndex === 0)
                const last = (splitIndex === splitFields.length - 1)
                const isCollection = (collections.includes(s))
                tempCollection = isCollection
                console.log(first)
                splitIndex++
                if (first) {
                    if (isCollection) {
                        const letter = nextLetter(collectionIndex)
                        filterString = `${s}/any(${letter}: ${letter}`
                        collectionIndex++
                    } else {
                        filterString = s
                    }
                } else if (last) {
                    const out = typeof(filter["value"])
                    if(typeof(filter["value"]) === 'string'){
                        filterString += `/${s} eq '${filter["value"]}'`
                    } else {
                        filterString += `/${s} eq ${filter["value"]}`
                    }
                    
                    for (let i = 0; i < collectionIndex; i++) {
                        filterString += ')'
                    }
                } else {
                    if (isCollection) {
                        const letter = nextLetter(collectionIndex)
                        filterString += `/${s}/any(${letter}: ${letter}`
                        collectionIndex++
                    } else {
                        filterString += `/${s}`
                    }
                }

            }
        } else {    
            filterString += `${filter["field"]} eq '${filter["value"]}'`
        }
        filterStrings.push(filterString)
    }

    let result = ""
    let index = 0
    for(const filterString of filterStrings){
        if(index === 0){
            result = filterString
        } else {
            result += ` and ${filterString}`
        }
        index++
    }

    return result
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
        let body = {
            search: req.body.q,
            count: true,
            facets: req?.body?.facets ? req.body.facets : [],
            filter: req?.body?.facets ? constructFilter(req.body.filters, req.body.filterCollections) : "",
            queryType: req?.body?.useSemanticSearch == true ? "semantic" : "simple",
            skip: req.body.skip,
            top: req.body.top,
            semanticConfiguration: req.body.semanticConfig,
            queryLanguage: req.body.queryLanguage,
            suggesterName: "autocomplete"
        }
        if(body.queryType === 'semantic'){
            body['answers'] = "extractive|count-3"
            body['captions'] = "extractive|highlight-true"
        }
        if (index) {
            let url = `${process.env.COGSEARCH_URL}/indexes/${index}/docs/autocomplete?api-version=2021-04-30-Preview`
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
