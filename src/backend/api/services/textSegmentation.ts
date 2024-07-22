import { BpaServiceObject } from "../engine/types";
import { BlobStorage } from "./storage";
const _ = require('lodash')

export class TextSegmentation {

    constructor() {

    }

    private _getOverlapText = (text : string, overlapSize : number) : string => {

        if(overlapSize > text.length){
            return ""
        }

        return text.substring(text.length - overlapSize, text.length)
    }

    public process = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        if(!input?.data?.pages){
            return await this.processText(input, index)
        }

        const maxSegment: number = Number(input.serviceSpecificConfig.maxSegment)
        const overlap: number = Number(input.serviceSpecificConfig.overlap) || 0
        const container: string = input.serviceSpecificConfig.containerName
        const folder: string = input.serviceSpecificConfig.folderName
        const blob: BlobStorage = new BlobStorage(process.env.AzureWebJobsStorage, container)

        let segment = ""
        let pageNumber = 1
        let lastLine = ""
        let counter = 0
        let overlapText = ""
        for (const page of input.data.pages) {
            pageNumber = page.pageNumber
            if (page.lines) {
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
                            id: input.id,
                            vector: input.vector
                        })
                        segment = this._getOverlapText(segment, overlap)
                    }
                    segment += " " + line.content
                    lastLine = line.content
                }
            } else if (page.words) {
                for (const word of page.words) {
                    if (segment.length + word.content.length > maxSegment) {
                        input.aggregatedResults["textSegmentation"] = segment
                        await blob.toTxt({
                            filename: `${folder}/${input.filename}_directory/${pageNumber}_${counter++}_${input.filename}`,
                            pipeline: input.pipeline,
                            type: "textSegmentation",
                            label: "textSegmentation",
                            bpaId: input.bpaId,
                            aggregatedResults: {}, //input.aggregatedResults,
                            data: segment,
                            serviceSpecificConfig: input.serviceSpecificConfig,
                            id: input.id,
                            vector: input.vector
                        })
                        segment = this._getOverlapText(segment, overlap)
                    }
                    segment += " " + word.content
                    lastLine = word.content
                }
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
            id: input.id,
            vector: input.vector
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
            id: input.id,
            vector: input.vector
        }
    }

    public processByPage = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        const container: string = input.serviceSpecificConfig.containerName
        const folder: string = input.serviceSpecificConfig.folderName
        const overlap: number = Number(input.serviceSpecificConfig.maxSegment) || 0
        const blob: BlobStorage = new BlobStorage(process.env.AzureWebJobsStorage, container)

        let counter = 0
        for (const page of input.data.pages) {
            let outText = ""
            if (page.lines) {
                for (const line of page.lines) {
                    outText += " " + line.content
                }
            } else if (page.words) {
                for (const word of page.words) {
                    outText += " " + word.content
                }
            }
            input.aggregatedResults["textSegmentation"] = outText
            await blob.toTxt({
                filename: `${folder}/${input.filename}_directory/${counter++}_${input.filename}`,
                pipeline: input.pipeline,
                type: "textSegmentation",
                label: "textSegmentation",
                bpaId: input.bpaId,
                aggregatedResults: {}, //input.aggregatedResults,
                data: outText,
                serviceSpecificConfig: input.serviceSpecificConfig,
                id: input.id,
                vector: input.vector
            })
        }

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
            id: input.id,
            vector: input.vector
        }
    }


    public processText = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        const maxSegment: number = Number(input.serviceSpecificConfig.maxSegment)
        const overlap: number = Number(input.serviceSpecificConfig.overlap) || 0
        const container: string = input.serviceSpecificConfig.containerName
        const folder: string = input.serviceSpecificConfig.folderName
        const blob: BlobStorage = new BlobStorage(process.env.AzureWebJobsStorage, container)

        const words = input.data.split(" ")

        const segments = []
        let current = ""
        for(const word of words){
            current += word + " "
            if(current.length > maxSegment){
                segments.push(current)
                current = this._getOverlapText(current, overlap)
            }
        }
        segments.push(current)

        let counter = 0
        for(const segment of segments){
            input.aggregatedResults["textSegmentation"] = { pageNumber: "na", text: segment }
            input.resultsIndexes.push({ index: index, name: "textSegmentation", type: "textSegmentation" })
            await blob.toTxt({
                filename: `${folder}/${counter++}_${input.filename}`,
                pipeline: input.pipeline,
                type: "textSegmentation",
                label: "textSegmentation",
                bpaId: input.bpaId,
                aggregatedResults: {}, //input.aggregatedResults,
                data: segment,
                serviceSpecificConfig: { containerName: "documents" },
                id: input.id,
                vector: input.vector
            })
        }

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
            id: input.id,
            vector: input.vector
        }
    }

    public tableToText = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        const container: string = input.serviceSpecificConfig.containerName
        const folder: string = input.serviceSpecificConfig.folderName
        const blob: BlobStorage = new BlobStorage(process.env.AzureWebJobsStorage, container)

        //const words = input.data.split(" ")

        const tables = input.data.tables
        const texts = []

        for(const table of tables){
            let text = ' '
            let rowIndex = 0
            for(const cell of table.cells){
                if(rowIndex !== cell.rowIndex){
                    rowIndex = cell.rowIndex
                    text += `|\n|  ${cell.content}`
                } else {
                    text += `|  ${cell.content}  `
                }
            }
            text += '|'
            texts.push(text)
        }
       

        let counter = 0
        for(const text of texts){
            input.aggregatedResults["tableToText"] = { text: text }
            input.resultsIndexes.push({ index: index, name: "tableToText", type: "tableToText" })
            await blob.toTxt({
                filename: `${folder}/${counter++}_${input.filename}`,
                pipeline: input.pipeline,
                type: "tableToText",
                label: "tableToText",
                bpaId: input.bpaId,
                aggregatedResults: {}, //input.aggregatedResults,
                data: text,
                serviceSpecificConfig: { containerName: "documents" },
                id: input.id,
                vector: input.vector
            })
        }

        return {
            data: "",
            label: "tableToText",
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            type: "tableToText",
            aggregatedResults: {}, //input.aggregatedResults,
            resultsIndexes: [], //input.resultsIndexes,
            index: index,
            id: input.id,
            vector: input.vector
        }
    }

}