import { ComputerVisionClient } from "@azure/cognitiveservices-computervision"
import { ApiKeyCredentials } from "@azure/ms-rest-js"
import { BpaServiceObject } from "../engine/types";
import { BlobStorage } from "./storage";
import axios, { AxiosRequestConfig } from "axios";

export class Vision {

    private _client: ComputerVisionClient
    private _apikey: string
    private _endpoint: string
    private _containerReadEndpoint: string
    private _blobClient: BlobStorage

    constructor(endpoint: string, apikey: string, blobClient: BlobStorage, containerReadEndpoint?: string) {
        this._client = new ComputerVisionClient(
            new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': apikey } }), endpoint);
        this._blobClient = blobClient
        this._apikey = apikey
        this._endpoint = endpoint
        this._containerReadEndpoint = containerReadEndpoint
    }

    private _configToFeatureString = (config : any) : string => {
        let out = ""
        const features = ["read","caption","denseCaptions","smartCrops","objects","tags","people"]
        let first = true
        for(const feature of features){
            if(config[feature]){
                if(first){
                    first = false
                }else{
                    out += ","
                }
                out += feature
            }
        }
        return out
    }

    private _getUrl = async (filename: string): Promise<string> => {
        const sasSourceUrl = await this._blobClient.getSasUrl(process.env.BLOB_STORAGE_ACCOUNT_NAME, process.env.BLOB_STORAGE_CONTAINER, process.env.BLOB_STORAGE_ACCOUNT_KEY)
        const url = `https://${process.env.BLOB_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/documents/${filename}?${sasSourceUrl}`

        return url
    }

    public process = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {

        const sourceUrl = await this._getUrl(input.filename)

        const headers: AxiosRequestConfig = {
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": this._apikey
            }
        }


        const serviceUrl = `${this._endpoint}computervision/imageanalysis:analyze?features=${this._configToFeatureString(input.serviceSpecificConfig)}&model-version=latest&language=${input.serviceSpecificConfig.language}&api-version=2023-02-01-preview`
        const data = {'url': sourceUrl}
        const axiosResult = await axios.post(serviceUrl, data, headers)

        const results = input.aggregatedResults
        results["imageAnalysis"] = axiosResult.data
        input.resultsIndexes.push({index : index, name : "imageAnalysis", type : "imageAnalysis"})
        const result : BpaServiceObject = {
            data : axiosResult.data,
            type : 'imageAnalysis',
            label : 'imageAnalysis',
            bpaId : input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            aggregatedResults : results,
            resultsIndexes : input.resultsIndexes,
            id: input.id,
            vector: input.vector
        }
        return result
    }

    

    
}