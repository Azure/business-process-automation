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

    // private _toText = (translationResults : any) : string => {
    //     let text = ""
    //     for(const result of translationResults){
    //         for(const t of result.translations){
    //             for(const r of t){
    //                 text += ` ${r.text}`
    //             }
    //         }
    //     }
    //     return text
    // }

    public translate = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {


        const headers = {
            'Ocp-Apim-Subscription-Key': this._apikey,
            'Ocp-Apim-Subscription-Region': this._region,
            'Content-type': 'application/json'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        let url = `${this._endpoint}translate?api-version=3.0&to=${input.serviceSpecificConfig.to}`
        if (input?.serviceSpecificConfig?.from) {
            url = `${this._endpoint}translate?api-version=3.0&to=${input.serviceSpecificConfig.to}&from=${input.serviceSpecificConfig.from}`
        }
        const data = [{ 'text': input.data.length > 45000 ? input.data.substring(0, 45000) : input.data }]

        const out = await axios.post(url, data, config)
        const results = input.aggregatedResults
        out.data.translationText = out.data[0].translations[0].text
        results["translation"] = {
            results: out.data,
            translationText: out.data[0].translations[0].text
        }
        input.resultsIndexes.push({ index: index, name: "translation", type: "text" })
        return {
            data: out.data[0].translations[0].text,
            type: "text",
            label: "translation",
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes,
            id: input.id,
            vector: input.vector
        }
    }


}