import { BpaServiceObject } from "../engine/types";
import { BlobStorage } from "../services/storage"

export class SplitPdf {

    constructor() {

    }

    public process = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        const blob : BlobStorage = new BlobStorage(process.env.AzureWebJobsStorage, input.serviceSpecificConfig.containerName)
        const folder: string = input.serviceSpecificConfig.folderName
        await blob.split(input.data, input.filename, folder)
            
        return {
            data: "",
            label: "splitPdf",
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            type: "splitPdf",
            aggregatedResults: {}, //input.aggregatedResults,
            resultsIndexes: [], //input.resultsIndexes,
            index: index,
            id: input.id
        }
    }
    
}