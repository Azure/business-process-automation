import { SearchIndexClient, AzureKeyCredential, SearchIndexerDataSourceConnection, SearchIndexerClient, SearchIndex, SearchIndexer } from "@azure/search-documents"

export class CognitiveSearch {

  private _indexClient: SearchIndexClient
  private _indexerClient: SearchIndexerClient

  constructor(endpoint: string, apikey: string) {
    this._indexClient = new SearchIndexClient(endpoint, new AzureKeyCredential(apikey));
    this._indexerClient = new SearchIndexerClient(endpoint, new AzureKeyCredential(apikey));
  }

  public create = async (pipelineName: string): Promise<SearchIndexer> => {
    const dataSource = await this._createDataSource(pipelineName, process.env.BLOB_STORAGE_CONNECTION_STRING)
    const index = await this._createIndex(pipelineName)
    const indexer = await this._createIndexer(pipelineName, dataSource.name, index.name)
    return indexer
  }

  private _createDataSource = async (dataSourceConnectionName: string, blobConnectionString: string): Promise<SearchIndexerDataSourceConnection> => {
    const dataSourceConnection: SearchIndexerDataSourceConnection = {
      name: dataSourceConnectionName,
      description: "",
      type: "azureblob",
      container: {
        name: "results",
        query: `${dataSourceConnectionName}-stage3`
      },
      connectionString: blobConnectionString
    };
    console.log("creating DataSource")
    return await this._indexerClient.createDataSourceConnection(dataSourceConnection);
  }

  private _createIndex = async (indexName: string) => {
    const index: SearchIndex =
    {
      "name": indexName,
      "defaultScoringProfile": "",
      "fields": [

        {
          "name": "label",
          "type": "Edm.String",
          "searchable": false,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": false,







        },
        {
          "name": "pipeline",
          "type": "Edm.String",
          "searchable": false,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": false,







        },
        {
          "name": "text",
          "type": "Edm.String",
          "searchable": true,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": false,







        },
        {
          "name": "type",
          "type": "Edm.String",
          "searchable": false,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": false,







        },
        {
          "name": "filename",
          "type": "Edm.String",
          "searchable": false,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": false,







        },
        {
          "name": "bpaId",
          "type": "Edm.String",
          "searchable": false,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": false,







        },
        {
          "name": "aggregatedResults",
          "type": "Edm.ComplexType",
          "fields": [
            {
              "name": "text",
              "type": "Edm.String",
              "searchable": true,
              "filterable": false,

              "sortable": false,
              "facetable": false,
              "key": false,







            }
          ]
        },
        {
          "name": "resultsIndexes",
          "type": "Collection(Edm.ComplexType)",
          "fields": [
            {
              "name": "index",
              "type": "Edm.Int64",
              "searchable": false,
              "filterable": false,

              "sortable": false,
              "facetable": false,
              "key": false,







            },
            {
              "name": "name",
              "type": "Edm.String",
              "searchable": false,
              "filterable": false,

              "sortable": false,
              "facetable": false,
              "key": false,







            },
            {
              "name": "type",
              "type": "Edm.String",
              "searchable": false,
              "filterable": false,

              "sortable": false,
              "facetable": false,
              "key": false,







            },

            {
              "name": "id",
              "type": "Edm.String",
              "searchable": false,
              "filterable": false,

              "sortable": false,
              "facetable": false,
              "key": false,







            }
          ]
        },
        {
          "name": "metadata_storage_content_type",
          "type": "Edm.String",
          "searchable": false,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": false,







        },
        {
          "name": "metadata_storage_size",
          "type": "Edm.Int64",
          "searchable": false,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": false,







        },
        {
          "name": "metadata_storage_last_modified",
          "type": "Edm.DateTimeOffset",
          "searchable": false,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": false,







        },
        {
          "name": "metadata_storage_content_md5",
          "type": "Edm.String",
          "searchable": false,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": false,







        },
        {
          "name": "metadata_storage_name",
          "type": "Edm.String",
          "searchable": false,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": false,







        },
        {
          "name": "metadata_storage_path",
          "type": "Edm.String",
          "searchable": false,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": true,







        },
        {
          "name": "metadata_storage_file_extension",
          "type": "Edm.String",
          "searchable": false,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": false,







        },
        {
          "name": "metadata_content_encoding",
          "type": "Edm.String",
          "searchable": false,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": false,







        },
        {
          "name": "metadata_content_type",
          "type": "Edm.String",
          "searchable": false,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": false,







        },
        {
          "name": "metadata_language",
          "type": "Edm.String",
          "searchable": false,
          "filterable": false,

          "sortable": false,
          "facetable": false,
          "key": false,







        }
      ],
      "scoringProfiles": [],
      "corsOptions": null,
      "suggesters": [],
      "analyzers": [],

      "tokenizers": [],
      "tokenFilters": [],
      "charFilters": [],
      "encryptionKey": null,


    }
    console.log("creating Index")
    return this._indexClient.createIndex(index)
  }

  private _createIndexer = async (indexerName: string, dataSourceName: string, indexName: string): Promise<SearchIndexer> => {
    const indexer: SearchIndexer = {
      name: indexerName,
      dataSourceName: dataSourceName,
      targetIndexName: indexName,
      parameters: {
        configuration: {
          dataToExtract: "contentAndMetadata",
          parsingMode: "json"
        }
      },
      fieldMappings: [
        {
          sourceFieldName: "/document/aggregatedResults/text",
          targetFieldName: "text",
          mappingFunction: null
        },
        {
          sourceFieldName: "metadata_storage_path",
          targetFieldName: "metadata_storage_path",
          mappingFunction: {
            name: "base64Encode",
            parameters: null
          }
        }
      ],
    }
    console.log("creating Indexer")
    return await this._indexerClient.createIndexer(indexer)
  }
}
