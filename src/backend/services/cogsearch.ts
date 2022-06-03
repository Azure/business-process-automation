import { SearchIndexClient, SearchIndexerClient, AzureKeyCredential, SearchIndexer, SearchIndexerDataSourceConnection, SearchIndex } from "@azure/search-documents";
import axios, { AxiosRequestConfig } from 'axios'

export class CogSearch {
    private _url: string
    private _apikey: string
    private _projectName: string

    constructor(url: string, apikey: string, projectName: string) {
        this._apikey = apikey
        this._url = url
        this._projectName = projectName
    }

    public generateCustomSearchSkill = async (inputObject: any): Promise<void> => {
        //const skillset = await this._generateSkillSet(this._projectName, targetSkillUrl)
        const dataSource = await this._generateDataSource(this._projectName)
        const index = await this._generateIndex(this._projectName, inputObject)
        await this._generateIndexer(this._projectName, dataSource.name, index.name, null)
    }

    // private _generateSkillSet = async (name: string, targetSkillUrl: string) => {
    //     const skill: any =
    //     {
    //         "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
    //         name: name,
    //         description: "BPA Accelerator Skillset",
    //         context: "/document",
    //         uri: `${targetSkillUrl}`,
    //         httpMethod: "POST",
    //         timeout: "PT230S",
    //         batchSize: 1,
    //         degreeOfParallelism: 1,
    //         inputs: [
    //             {
    //                 name: "filename",
    //                 source: "/document/metadata_storage_name"
    //             }
    //         ],
    //         outputs: [
    //             {
    //                 name: "aggregatedResults",
    //                 targetName: "aggregatedResults"
    //             }
    //         ],
    //         httpHeaders: {}
    //     }


    //     const skillset: SearchIndexerSkillset = {
    //         name: name,
    //         skills: [
    //             skill
    //         ]
    //     }
    //     const config: AxiosRequestConfig = {
    //         headers: {
    //             "Content-Type": "application/json",
    //             "api-key": this._apikey
    //         }
    //     }
    //     const url = `${this._url}/skillsets?api-version=2020-06-30`
    //     const postResult = await axios.post(url, skillset, config)
    //     return postResult.data
    // }

    private _generateDataSource = async (name: string): Promise<SearchIndexerDataSourceConnection> => {
        const dataSourceConnection: any = {
            name: name,
            description: "BPA Accelerator Datasource Connection",
            type: "cosmosdb",
            credentials: {
                connectionString: `${process.env.COSMOSDB_CONNECTION_STRING}Database=${process.env.COSMOSDB_DB_NAME}`
            },
            container: {
                "name": process.env.COSMOSDB_CONTAINER_NAME,
                "query": "SELECT * from c WHERE c.id != '1' AND c.id != '2' AND c._ts >= @HighWaterMark ORDER by c._ts"
            },
            "dataChangeDetectionPolicy": {
                "@odata.type": "#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy",
                "highWaterMarkColumnName": "_ts"
            },
            dataDeletionDetectionPolicy: null,
            encryptionKey: null,
        }

        const config: AxiosRequestConfig = {
            headers: {
                "Content-Type": "application/json",
                "api-key": this._apikey
            }
        }
        const url = `${this._url}/datasources?api-version=2020-06-30`
        const postResult = await axios.post(url, dataSourceConnection, config)
        return postResult.data

        // const indexerClient = new SearchIndexerClient(this._url, new AzureKeyCredential(this._apikey));
        // const connection = await indexerClient.createDataSourceConnection(dataSourceConnection)
        // return connection
    }

    private _generateIndex = async (name: string, fields: any): Promise<SearchIndex> => {
        let searchIndex: SearchIndex = {
            name: "",
            fields: []
        }
        const indexFormat = this._convertToIndex(fields, "fields")

        const all = {
            "name": name,
            "fields": [...indexFormat]
        }

        const indexClient = new SearchIndexClient(this._url, new AzureKeyCredential(this._apikey));
        searchIndex = await indexClient.createIndex(all)

        return searchIndex
    }


    private _generateIndexer = async (name: string, dataSourceName: string, targetIndexName: string, skillsetName: string): Promise<SearchIndexer> => {
        const indexerClient = new SearchIndexerClient(this._url, new AzureKeyCredential(this._apikey));
        const indexerObject: SearchIndexer = {
            name: name,
            dataSourceName: dataSourceName,
            targetIndexName: targetIndexName,
            skillsetName: skillsetName,
            outputFieldMappings: [
                // {
                //     sourceFieldName: "/document/aggregatedResults",
                //     targetFieldName: "aggregatedResults"
                // }
            ]
        }
        const indexer = await indexerClient.createIndexer(indexerObject)
        return indexer
    }


    private _isInt = (n: number) => {
        return n % 1 === 0;
    }


    private _convertToIndex = (inputObject: any, key: string): any => {
        let type: string = ""
        let indexSchema: any = []
        for (const s in inputObject) {
            switch (typeof (inputObject[s])) {
                case 'object':
                    type = 'object'
                    if (Array.isArray(inputObject[s])) {
                        type = 'array'
                        console.log(`${key} ${s} : array`)
                        if (inputObject[s].length > 0) {
                            if (inputObject[s].length > 0) {
                                if (typeof (inputObject[s][0]) === 'string') {
                                    indexSchema.push({
                                        "name": s,
                                        "type": "Collection(Edm.String)",
                                        "analyzer": null,
                                        "synonymMaps": [],
                                        "fields": []
                                    })
                                }
                                if (typeof (inputObject[s][0]) === 'object') {
                                    indexSchema.push({
                                        "name": s,
                                        "type": "Collection(Edm.ComplexType)",
                                        "fields": this._convertToIndex(inputObject[s][0], s)
                                    })
                                }
                                if (typeof (inputObject[s][0]) === 'number') {
                                    if (this._isInt(inputObject[s])) {
                                        indexSchema.push({
                                            "name": s,
                                            "type": "Collection(Edm.Int64)",
                                            "fields": []
                                        })
                                    } else {
                                        indexSchema.push({
                                            "name": s,
                                            "type": "Collection(Edm.Double)",
                                            "fields": []
                                        })
                                    }
                                }
                            } else {
                            }

                            console.log(indexSchema)
                        }
                    } else if (inputObject[s] instanceof Date) {
                        const stringElement = {
                            "name": s,
                            "type": "Edm.String",
                            "key": false,
                            "facetable": false,
                            "filterable": false,
                        }
                        indexSchema.push(stringElement)
                    }
                    else {
                        console.log(`${key} ${s} : ${typeof (inputObject[s])}`)
                        indexSchema.push({
                            "name": s,
                            "type": "Edm.ComplexType",
                            "fields": this._convertToIndex(inputObject[s], s)
                        })
                    }
                    break;
                case 'string':
                    let stringElement = {}
                    if (key === 'fields' && s === 'id') {
                        stringElement = {
                            "name": s,
                            "type": "Edm.String",
                            "key": true,
                            "facetable": false,
                            "filterable": false,
                        }
                    } else {
                        stringElement = {
                            "name": s,
                            "type": "Edm.String",
                            "key": false,
                            "facetable": false,
                            "filterable": false,
                        }
                    }
                    indexSchema.push(stringElement)
                    break;
                case 'number':
                    const numElement = {
                        "name": s,
                        "type": "Edm.Double",
                        "facetable": false,
                        "filterable": false
                    }
                    indexSchema.push(numElement)

                    break;
                case 'boolean':
                    const boolElement = {
                        "name": s,
                        "type": "Edm.Boolean",
                        "facetable": false,
                        "filterable": false
                    }
                    indexSchema.push(boolElement)
                    break;
                default:
                    const type2 = typeof (inputObject[s])
                    console.log(type2)
                    break
            }

        }
        return indexSchema
    }


}