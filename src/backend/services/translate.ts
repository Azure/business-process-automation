import { BpaServiceObject } from "../engine/types";
import {  v4 as uuidv4 } from "uuid"
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

    public translate = async (input: BpaServiceObject): Promise<BpaServiceObject> => {

        try {
            const headers = {
                'Ocp-Apim-Subscription-Key': this._apikey,
                'Ocp-Apim-Subscription-Region': this._region,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            }

            const config: AxiosRequestConfig = {
                headers: headers
            }

            const url = `${this._endpoint}translate?api-version=3.0&to=${input.serviceSpecificConfig.to}`
            console.log(url)

            const out = await axios.post(url, [{ 'text': input.data }], config)
            return {
                data: out.data[0].translations[0].text,
                type: "text",
                label: "translated text",
                projectName: input.projectName,
                bpaId: input.bpaId
            }

        } catch (err) {
            console.log(err)
        }


    }
}