import { BpaServiceObject } from "../engine/types";
import axios, { AxiosRequestConfig } from "axios"

export class ContentModerator {

    private _endpoint: string
    private _apikey: string

    constructor(endpoint: string, apikey: string) {
        this._endpoint = endpoint
        this._apikey = apikey
    }

    public text = async (input: BpaServiceObject, index : number): Promise<BpaServiceObject> => {
        const headers = {
            'Ocp-Apim-Subscription-Key': this._apikey,
            'Content-type': 'text/plain'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }
        let url = `${this._endpoint}contentmoderator/moderate/v1.0/ProcessText/Screen`
        
        console.log(url)

        const out = await axios.post(url, input.data, config)
        const results = input.aggregatedResults
        results["contentModeratorText"] = out.data
        input.resultsIndexes.push({index : index, name : "contentModeratorText", type : "contentModeratorText"})
        return {
            data: out.data,
            type: "contentModeratorText",
            label: "contentModeratorText",
            projectName: input.projectName,
            bpaId: input.bpaId,
            aggregatedResults: results,
            resultsIndexes : input.resultsIndexes
        }

    }
}