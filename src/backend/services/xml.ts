import { BpaServiceObject, ResultsIndex } from "../engine/types";
import * as xml2json from "xml2js"

export class Xml {
    
    public process = async (input: BpaServiceObject, index : number): Promise<BpaServiceObject> => {

        const out = await xml2json.parseStringPromise(input.data)
        
        const results = input.aggregatedResults
        results["xml2Json"] = out
        input.resultsIndexes.push({index : index, name : "xml2Json", type : "xml2Json"})
        const result : BpaServiceObject = {
            data : out,
            type : 'xml2Json',
            label : 'xml2Json',
            bpaId : input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            aggregatedResults : results,
            resultsIndexes : input.resultsIndexes
        }
        return result

    }
}