import { BpaServiceObject } from "../engine/types";
import axios from 'axios'

export class HuggingFace {

    private _endpoint
    
    constructor(endpoint : string){
        this._endpoint = endpoint
    }

    public process = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        const body = {
            text : input.data,
            modelId : input.serviceSpecificConfig.modelId
        }
        console.log(JSON.stringify(body))
        const result = await axios.post(`${this._endpoint}/api/analyze`, body)
        const results = input.aggregatedResults
        results["huggingFaceNer"] = result
        input.resultsIndexes.push({index : index, name : "huggingFaceNer", type : "huggingFaceNer"})
        return {
            data : result.data,
            label : "huggingFaceNer",
            bpaId : input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            type : "huggingFaceNer",
            aggregatedResults : results,
            resultsIndexes : input.resultsIndexes
        }
    }

}