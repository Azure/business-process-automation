import { BpaServiceObject } from "../engine/types";
import axios from 'axios'

export class Preprocess {

    private _endpoint
    
    constructor(endpoint : string){
        this._endpoint = endpoint
    }

    public process = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        const body = {
            text : input.data
        }
        const result = await axios.post(`${this._endpoint}/api/preprocess`, body)
        const results = input.aggregatedResults
        results["preprocess"] = result
        input.resultsIndexes.push({index : index, name : "preprocess", type : "preprocess"})
        return {
            data : result.data,
            label : "preprocess",
            bpaId : input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            type : "preprocess",
            aggregatedResults : results,
            resultsIndexes : input.resultsIndexes,
            id: input.id
        }
    }

    public textSegmentation = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        const body = {
            text : input.data
        }
        const result = await axios.post(`${this._endpoint}/api/textSegmentation`, body)
        const results = input.aggregatedResults
        results["textSegmentation"] = result
        input.resultsIndexes.push({index : index, name : "textSegmentation", type : "segmtextSegmentationent"})
        return {
            data : result.data,
            label : "textSegmentation",
            bpaId : input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            type : "textSegmentation",
            aggregatedResults : results,
            resultsIndexes : input.resultsIndexes,
            id: input.id
        }
    }

}