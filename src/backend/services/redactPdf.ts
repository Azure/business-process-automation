import { PDFDocument, PDFPage, rgb } from "pdf-lib";
import { BpaServiceObject } from '../engine/types'
//import { BlobServiceClient, ContainerClient, BlockBlobClient, ContainerGenerateSasUrlOptions, ContainerSASPermissions } from "@azure/storage-blob"


export class RedactPdf {

    constructor(){

    }

    public process = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const pdfDoc = await PDFDocument.load(input.aggregatedResults.buffer)
        const pdfPage = pdfDoc.getPage(0)
        const ocrPageResults = input.aggregatedResults.ocr.pages[0]
        const piiResults = input.aggregatedResults.recognizePiiEntities[0].recognizePiiEntitiesResults[0]
        const redacted = this._redactPage(pdfPage, ocrPageResults, piiResults)
        const redactedPage : Buffer = await this._drawRedactedPage(redacted, pdfPage, ocrPageResults, pdfDoc)

        const label = "redactPdf"

        input.aggregatedResults[label] = {
            outputLocation: "somewhere",
            status: "success"
        }
        input.resultsIndexes.push({ index: index, name: label, type: "redactPdf" })

        return {
            data: {
                outputLocation: "somewhere",
                status: "success"
            },
            index: index,
            type: "redactPdf",
            label: label,
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            aggregatedResults: input.aggregatedResults,
            resultsIndexes: input.resultsIndexes
        }
    }

    private _drawRedactedPage = async (redacted : any[], page : PDFPage, ocrPageResults, pdfDoc : PDFDocument) : Promise<Buffer> => {
        const { width, height } = page.getSize()
        const ocrWidth = ocrPageResults.width
        const ocrHeight = ocrPageResults.height
        const yScale = height / ocrHeight
        const xScale = width / ocrWidth
        for(const r of redacted){
            let minX = null
            let minY = null
            let maxX = null
            let maxY = null
            for(const p of r.polygon){
                if(!minX){
                    minX = p.x
                }
                if(!maxX){
                    maxX = p.x
                }
                if(!minY){
                    minY = p.y
                }
                if(!maxY){
                    maxY = p.y
                }
                if(p.x > maxX){
                    maxX = p.x
                }
                if(p.x < minX){
                    minX = p.x
                }
                if(p.y > maxY){
                    maxY = p.y
                }
                if(p.y < minY){
                    minY = p.y
                }
            }
            const xPosition = minX * xScale
            const yPosition = minY * yScale
            const newWidth = (maxX - minX) * xScale
            const newHeight = (maxY - minY) * yScale
        
            page.drawRectangle({
                x: xPosition,
                y: (height) - yPosition - newHeight,
                width: newWidth,
                height: newHeight,
                color: rgb(0.0, 0.0, 0.0),
                opacity: 1.0
            })
        }
        const outBuffer = await pdfDoc.save()
    
        return Buffer.from(outBuffer)
    }


    private _isRedactedEntity = (words, wordsIndex, piiSplit): boolean => {
        let _index = wordsIndex
        for (const pii of piiSplit) {
            if (pii !== words[_index].content && pii !== words[_index].content.replace(/\W/g, '')) {
                return false
            }
            _index++
        }
    
        return true
    }
    
    private _redactPage = (page: PDFPage, pageResults, piiResults) => {
        let piiIndex = 0
        const redacted = []
        let offset = 0
        for (let i = 0; i < pageResults.words.length; i++) {
            const word = pageResults.words[i]
            offset += word.content.length
            const pii = piiResults.results[0].entities[piiIndex]
            const piiSplit = pii.text.trim().split(' ')
            if (this._isRedactedEntity(pageResults.words, i, piiSplit)) {
                const offset = i
                for (; i < offset + piiSplit.length; i++) {
                    redacted.push(pageResults.words[i])
                }
                i = offset
                const lastPii = piiResults.results[0].entities[piiIndex]
                let nextPii
                const entitiesLength = piiResults.results[0].entities.length
                if (entitiesLength > piiIndex + 1) {
                    piiIndex++
                    nextPii = piiResults.results[0].entities[piiIndex]
                    if (lastPii.offset + lastPii.length >= nextPii.offset + nextPii.length) {
                        console.log('weird')
                        piiIndex++
                    }
                } else {
                    break;
                }
            }
        }
        return redacted
    }
    
    // private _redactPdf = async (pathToPdf: string) => {
    
    //     const docmentAsBytes = await fs.promises.readFile(pathToPdf);
    //     const pdfDoc = await PDFDocument.load(docmentAsBytes)
    
    //     //    const subDocument = await PDFDocument.create();
    //     //    const [copiedPage] = await subDocument.copyPages(pdfDoc, [0])
    
    //     //    subDocument.addPage(copiedPage)
    //     const newPage = pdfDoc.getPage(0)
    //     const { width, height } = newPage.getSize()
    //     const yScale = height / 11.1389
    //     const xScale = width / 8.6667
    
    //     const ocrResults = mydocument.aggregatedResults.ocr.pages
    
    //     //for(let i=0;i<mydocument.aggregatedResults.ocr.pages.length;i++){
    //     const pdfPage = pdfDoc.getPage(0)
    //     const pageResults = mydocument.aggregatedResults.ocr.pages[0]
    //     const piiResults = mydocument.aggregatedResults.recognizePiiEntities[0].recognizePiiEntitiesResults[0]
    //     const redacted = redactPage(pdfPage, pageResults, piiResults)
    //     //}
    
    //     for(const r of redacted){
    //         let minX = null
    //         let minY = null
    //         let maxX = null
    //         let maxY = null
    //         for(const p of r.polygon){
    //             if(!minX){
    //                 minX = p.x
    //             }
    //             if(!maxX){
    //                 maxX = p.x
    //             }
    //             if(!minY){
    //                 minY = p.y
    //             }
    //             if(!maxY){
    //                 maxY = p.y
    //             }
    //             if(p.x > maxX){
    //                 maxX = p.x
    //             }
    //             if(p.x < minX){
    //                 minX = p.x
    //             }
    //             if(p.y > maxY){
    //                 maxY = p.y
    //             }
    //             if(p.y < minY){
    //                 minY = p.y
    //             }
    //         }
    //         const xPosition = minX * xScale
    //         const yPosition = minY * yScale
    //         const newWidth = (maxX - minX) * xScale
    //         const newHeight = (maxY - minY) * yScale
        
    //         newPage.drawRectangle({
    //             x: xPosition,
    //             y: (height) - yPosition - newHeight,
    //             width: newWidth,
    //             height: newHeight,
    //             color: rgb(0.0, 0.0, 0.0),
    //             opacity: 1.0
    //         })
    //     }
    
    
    //     const pdfBytes = await pdfDoc.save()
    // }
    
}







