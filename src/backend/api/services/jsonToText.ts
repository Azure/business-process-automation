import { BpaServiceObject } from "../engine/types";
import axios, { AxiosRequestConfig } from "axios"

export class JsonToText {

    constructor() {

    }


    public process = async (input: BpaServiceObject, index : number): Promise<BpaServiceObject> => {
        
        let text = ""
        const parts = input.serviceSpecificConfig.textFields.split(',')
        for(const part of parts){
            text += input.data[part] + "\n"
        }
        const results = input.aggregatedResults
        results["jsonToText"] = text
        input.resultsIndexes.push({index : index, name : "jsonToText", type : "text"})
        return {
            data: text,
            type: "text",
            label: "jsonToText",
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            aggregatedResults: results,
            resultsIndexes : input.resultsIndexes,
            vector : input.vector
        }

    }
}