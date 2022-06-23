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

        const dividedText = this._divideText(input.data)
        const result = []
        for(const t of dividedText){
            const language = await this._detectLanguage(t)
            const headers = {
                'Ocp-Apim-Subscription-Key': this._apikey,
                'Content-type': 'text/plain'
            }
    
            const config: AxiosRequestConfig = {
                headers: headers
            }
            let url = `${this._endpoint}contentmoderator/moderate/v1.0/ProcessText/Screen?language=${language["DetectedLanguage"]}`
            
            //console.log(url)
    
            const out = await axios.post(url, t, config)
            result.push(out.data)
        }
        
        const results = input.aggregatedResults
        results["contentModeratorText"] = result
        input.resultsIndexes.push({index : index, name : "contentModeratorText", type : "contentModeratorText"})
        return {
            data: result,
            type: "contentModeratorText",
            label: "contentModeratorText",
            projectName: input.projectName,
            bpaId: input.bpaId,
            aggregatedResults: results,
            resultsIndexes : input.resultsIndexes
        }

    }

    private _divideText = (text : string) : string[] => {
        const out : string[] = []
        do {
            const tempText = text.substring(0,1023)
            const tempSplit = tempText.split(' ')
            const offset = tempSplit[tempSplit.length-1].length
            out.push(text.substring(0,1023 - offset - 1))
            text = text.substring(1023 - offset)
        } while(text.length > 0)
        return out
    }

    private _detectLanguage = async (text : string) : Promise<string> => {
        const headers = {
            'Ocp-Apim-Subscription-Key': this._apikey,
            'Content-type': 'text/plain'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }
        let url = `${this._endpoint}contentmoderator/moderate/v1.0/ProcessText/DetectLanguage`
        
        //console.log(url)

        const out = await axios.post(url, text, config)
        return out.data
    }
}