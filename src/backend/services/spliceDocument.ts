import { BpaServiceObject } from "../engine/types";
import { BlobStorage } from "../services/storage"


export class SpliceDocument {

    private _blob : BlobStorage

    constructor(blob : BlobStorage) {
        this._blob = blob
    }

    
    public process = async (input: BpaServiceObject, index : number): Promise<BpaServiceObject> => {

        const splicedDocument : Buffer = await this._blob.splicePdf(input.data, input.serviceSpecificConfig.from, input.serviceSpecificConfig.to)
        
        const label = "pdf"
        const results = input.aggregatedResults
        //results[label] = splicedDocument
        input.resultsIndexes.push({ index: index, name: label, type: "pdf" })
        return {
            data: splicedDocument,
            type: label,
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            label: label,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes
        }
    }
}