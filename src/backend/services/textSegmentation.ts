import { BpaServiceObject } from "../engine/types";
import { BlobStorage } from "./storage";
const _ = require('lodash')

export class TextSegmentation {

    private _blob: BlobStorage

    constructor(blob: BlobStorage) {
        this._blob = blob
    }

    public process = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        const maxSegment = input.serviceSpecificConfig.maxSegment | 1000

        let segment = ""
        let pageNumber = 1
        let lastLine = ""
        for (const page of input.data.pages) {
            pageNumber = page.pageNumber
            for (const line of page.lines) {
                if (segment.length + line.content.length > maxSegment) {
                    input.aggregatedResults["textSegmentation"] = segment
                    await this._blob.toTxt({
                        filename: `mytempcontainer/${input.filename}`,
                        pipeline: input.pipeline,
                        type: "textSegmentation",
                        label: "textSegmentation",
                        bpaId: input.bpaId,
                        aggregatedResults: input.aggregatedResults,
                        data: segment,
                        serviceSpecificConfig: { containerName: "documents" }
                    })
                    segment = lastLine
                }
                segment += " " + line.content
                lastLine = line.content
            }
        }

        input.aggregatedResults["textSegmentation"] = { pageNumber: pageNumber, text: segment }
        input.resultsIndexes.push({ index: index, name: "textSegmentation", type: "textSegmentation" })
        await this._blob.toTxt({
            filename: `mytempcontainer/${input.filename}`,
            pipeline: input.pipeline,
            type: "textSegmentation",
            label: "textSegmentation",
            bpaId: input.bpaId,
            aggregatedResults: input.aggregatedResults,
            data: segment,
            serviceSpecificConfig: { containerName: "documents" }
        })
        return {
            data: "",
            label: "textSegmentation",
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            type: "textSegmentation",
            aggregatedResults: input.aggregatedResults,
            resultsIndexes: input.resultsIndexes,
            index: index
        }
    }



}