import { BpaServiceObject } from "../engine/types";
import { BlobStorage } from "./storage";
const _ = require('lodash')

export class TextSegmentation {

    constructor() {
        
    }

    public process = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        const maxSegment : number = Number(input.serviceSpecificConfig.maxSegment) 
        const container : string = input.serviceSpecificConfig.containerName 
        const folder : string = input.serviceSpecificConfig.folderName

        const blob : BlobStorage = new BlobStorage(process.env.AzureWebJobsStorage, container)

        let segment = ""
        let pageNumber = 1
        let lastLine = ""
        let counter = 0
        for (const page of input.data.pages) {
            pageNumber = page.pageNumber
            for (const line of page.lines) {
                if (segment.length + line.content.length > maxSegment) {
                    input.aggregatedResults["textSegmentation"] = segment
                    await blob.toTxt({
                        filename: `${folder}/${pageNumber}_${counter++}_${input.filename}`,
                        pipeline: input.pipeline,
                        type: "textSegmentation",
                        label: "textSegmentation",
                        bpaId: input.bpaId,
                        aggregatedResults: {}, //input.aggregatedResults,
                        data: segment,
                        serviceSpecificConfig: input.serviceSpecificConfig,
                        id: input.id
                    })
                    segment = lastLine
                }
                segment += " " + line.content
                lastLine = line.content
            }
        }

        input.aggregatedResults["textSegmentation"] = { pageNumber: pageNumber, text: segment }
        input.resultsIndexes.push({ index: index, name: "textSegmentation", type: "textSegmentation" })
        await blob.toTxt({
            filename: `${folder}/${pageNumber}_${counter++}_${input.filename}`,
            pipeline: input.pipeline,
            type: "textSegmentation",
            label: "textSegmentation",
            bpaId: input.bpaId,
            aggregatedResults: {}, //input.aggregatedResults,
            data: segment,
            serviceSpecificConfig: { containerName: "documents" },
            id: input.id
        })
        return {
            data: "",
            label: "textSegmentation",
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            type: "textSegmentation",
            aggregatedResults: {}, //input.aggregatedResults,
            resultsIndexes: [], //input.resultsIndexes,
            index: index,
            id: input.id
        }
    }
}