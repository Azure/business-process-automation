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
        const resultText = rawText.replace(/ /g,"\n")
        return resultText
    }

    private _createOutput = (rawOutput) => {
        const result = []
        const splitText = rawOutput.split('\n')
        for(const item of splitText){
            const itemSplit = item.split(' ')
            result.push({text : itemSplit[0], classification : itemSplit[1]})
        }
        return result
    }

    public process = async (input: BpaServiceObject, index : number): Promise<BpaServiceObject> => {
        const headers = {
            'Authorization': `Bearer ${this._apikey}`,
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
        const modelOutput = this._createOutput(JSON.parse(out.data).Results)
        results["automlNer"] = modelOutput
        input.resultsIndexes.push({index : index, name : "automlNer", type : "automlNer"})
        return {
            data: modelOutput,
            type: "automlNer",
            label: "automlNer",
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            aggregatedResults: results,
            resultsIndexes : input.resultsIndexes
        }

    }
}