import { BpaServiceObject } from "../engine/types";
import { v4 as uuidv4 } from "uuid"
import axios, { AxiosRequestConfig } from "axios"

export class Translate {

    private _endpoint: string
    private _region: string
    private _apikey: string

    constructor(endpoint: string, apikey: string, region: string) {
        this._endpoint = endpoint
        this._region = region
        this._apikey = apikey
    }

    public translate = async (input: BpaServiceObject, index : number): Promise<BpaServiceObject> => {


        const headers = {
            'Ocp-Apim-Subscription-Key': this._apikey,
            'Ocp-Apim-Subscription-Region': this._region,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        let url = `${this._endpoint}translate?api-version=3.0&to=${input.serviceSpecificConfig.to}`
        if(input?.serviceSpecificConfig?.from){
            url = `${this._endpoint}translate?api-version=3.0&to=${input.serviceSpecificConfig.to}&from=${input.serviceSpecificConfig.from}`
        }
        console.log(url)

        const out = await axios.post(url, [{ 'text': input.data }], config)
        const results = input.aggregatedResults
        results["translation"] = out.data
        input.resultsIndexes.push({index : index, name : "translation", type : "text"})
        return {
            data: out.data[0].translations[0].text,
            type: "text",
            label: "translation",
            projectName: input.projectName,
            bpaId: input.bpaId,
            aggregatedResults: results,
            resultsIndexes : input.resultsIndexes
        }

    }
}