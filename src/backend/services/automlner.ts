import { BpaServiceObject } from "../engine/types";
import axios, { AxiosRequestConfig } from "axios"

export class AutoMlNer {

    private _endpoint: string
    private _apikey: string

    constructor(endpoint: string, apikey: string) {
        this._endpoint = endpoint
        this._apikey = apikey
    }

    private _tokenize = (rawText : string) : any => {

    }

    public process = async (input: BpaServiceObject): Promise<BpaServiceObject> => {
        const headers = {
            'Authorization': `BEARER ${this._apikey}`,
            'Content-type': 'application/json'
        }

        const body = {
            "Inputs": {
                "data": this._tokenize(input.data)
            },
            "GlobalParameters": 1.0
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        const out = await axios.post(this._endpoint, body, config)
        const results = input.aggregatedResults
        results["automlNer"] = out.data
        return {
            data: out.data,
            type: "automlNer",
            label: "automlNer",
            projectName: input.projectName,
            bpaId: input.bpaId,
            aggregatedResults: results
        }

    }
}