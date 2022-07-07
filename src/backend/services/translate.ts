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
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            aggregatedResults: results,
            resultsIndexes : input.resultsIndexes
        }

    }

    public getPricing = (pages : number) : number => {
        const million = 1000000
        const characters = pages * 3000
        if(characters < 250*million){
            return (characters/million)*10
        } else if (characters > 250*million && characters < (1000*million)){
            return 2055 + ((8.22*(characters-(250*million))/million))
        }else if (characters > (1000*million) && characters < (4000*million)){
            return 6000 + ((6.00*(characters-(250*million))/million))
        }else if (characters > (4000*million) ){
            return 2055 + ((5.50*(characters-(250*million))/million))
        }
        throw new Error("error in ContentModerator getPricing")
    }
}