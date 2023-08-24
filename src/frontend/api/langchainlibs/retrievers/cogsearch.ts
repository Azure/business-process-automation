import axios, { AxiosRequestConfig } from "axios"
import { BaseRetriever } from "langchain/schema/retriever";
import { Document } from "langchain/document";

export class CogSearchRetriever extends BaseRetriever {
    lc_namespace: string[];

    private _numDocs: number
    private _indexConfig: any

    constructor(parameters: any) {
        super()
        this._numDocs = parameters.numDocs
        this._indexConfig = parameters.indexConfig
    }

    private _search = async (query: string): Promise<any[]> => {
        try {
            if(this._indexConfig.searchableFields ){
                this._indexConfig.searchableFields = this._indexConfig.searchableFields.filter(sf => {
                  if(!sf.includes('vector')){
                    return sf
                  }
                })
              }

            const headers: AxiosRequestConfig = {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": process.env.COGSEARCH_APIKEY
                }
            }
            let body: any = {
                search: query,
                count: true,
                facets: [],
                filter: "",
                skip: 0,
                top: this._numDocs,
                semanticConfiguration: this._indexConfig?.semanticConfiguration && this._indexConfig?.semanticConfiguration.length > 0 ? this._indexConfig?.semanticConfiguration[0] : null,
                queryType: this._indexConfig?.semanticConfigurations && this._indexConfig?.semanticConfigurations.length > 0 ? "semantic" : "simple",
                answers: this._indexConfig?.semanticConfigurations && this._indexConfig?.semanticConfigurations.length > 0 ? "extractive|count-3" : null,
                captions: this._indexConfig?.semanticConfigurations && this._indexConfig?.semanticConfigurations.length > 0 ? "extractive|highlight-true" : null,
                queryLanguage: "en"
            }
            if (this._indexConfig) {
                let url = `${process.env.COGSEARCH_URL}/indexes/${this._indexConfig.name}/docs/search?api-version=2021-04-30-Preview`
                const axiosResult = await axios.post(url, body, headers)


                return axiosResult.data.value
            }

        } catch (err) {
            console.log(err)
        }
        return []
    }

    private _nextLetter = (index: number) => {
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
        return letters[index]
    }

    private _containsCollections = (filters: any, collections: any): boolean => {
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

    private _getText = (searchables, data) => {
        try {
            if (!searchables || searchables.length === 0) {
                return ""
            }
            let out = ""

            for (const s of searchables) {
                let currentData = data
                for (const i of s.split('/')) {
                    if (Array.isArray(currentData[i])) {
                        currentData = currentData[i][0]
                    } else {
                        currentData = currentData[i]
                    }
                }
                out += currentData
            }
            return `\nFilename : ${data.filename} \n${out}`
        } catch (err) {
            console.log(err)
        }

    }


    private _constructFilter = (filters: string[], collections: string[]) => {
        let filterStrings = []

        for (const filter of filters) {
            let filterString = ""
            if (this._containsCollections([filter], collections)) {
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
                            const letter = this._nextLetter(collectionIndex)
                            filterString = `${s}/any(${letter}: ${letter}`
                            collectionIndex++
                        } else {
                            filterString = s
                        }
                    } else if (last) {
                        const out = typeof (filter["value"])
                        if (typeof (filter["value"]) === 'string') {
                            filterString += `/${s} eq '${filter["value"]}'`
                        } else {
                            filterString += `/${s} eq ${filter["value"]}`
                        }

                        for (let i = 0; i < collectionIndex; i++) {
                            filterString += ')'
                        }
                    } else {
                        if (isCollection) {
                            const letter = this._nextLetter(collectionIndex)
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
        for (const filterString of filterStrings) {
            if (index === 0) {
                result = filterString
            } else {
                result += ` and ${filterString}`
            }
            index++
        }

        return result
    }

    getRelevantDocuments = async (query: string): Promise<Document<Record<string, any>>[]> => {
        const search = await this._search(query)
        const docs: Document<Record<string, any>>[] = []
        for (const v of search) {
            const doc: Document<Record<string, any>> = {
                pageContent: this._getText(this._indexConfig.searchableFields, v),
                metadata: v
            }
            docs.push(doc)
        }
        if(docs.length === 0){
            const doc: Document<Record<string, any>> = {
                pageContent: "No addtional content.",
                metadata: {}
            }
            docs.push(doc)
        }
        return docs
    }

}
