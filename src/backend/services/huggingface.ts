import { BpaServiceObject } from "../engine/types";
import axios from 'axios'

export class HuggingFace {

    private _endpoint
    
    constructor(endpoint : string){
        this._endpoint = endpoint
    }

    public process = async (input : BpaServiceObject) : Promise<BpaServiceObject> => {
        const body = {
            text : input.data,
            modelId : input.serviceSpecificConfig.modelId
        }
        console.log(JSON.stringify(body))
        const result = await axios.post(`${this._endpoint}/api/analyze`, body)
        return {
            data : result.data,
            label : "huggingFaceNer",
            bpaId : input.bpaId,
            projectName : input.projectName,
            type : "huggingFaceNer"
        }
    }

}