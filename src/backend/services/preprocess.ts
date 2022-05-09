import { BpaServiceObject } from "../engine/types";
import axios from 'axios'

export class Preprocess {

    private _endpoint
    
    constructor(endpoint : string){
        this._endpoint = endpoint
    }

    public process = async (input : BpaServiceObject) : Promise<BpaServiceObject> => {
        const body = {
            text : input.data
        }
        console.log(JSON.stringify(body))
        const result = await axios.post(`${this._endpoint}/api/preprocess`, body)
        return {
            data : result.data,
            label : "preprocess",
            bpaId : input.bpaId,
            projectName : input.projectName,
            type : "preprocess"
        }
    }

}