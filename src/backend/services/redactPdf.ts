import { PDFDocument, PDFPage, rgb } from "pdf-lib";
import { BpaServiceObject } from '../engine/types'
import { BlobStorage } from '../services/storage'
import * as pdf2Png from 'pdf-to-png-converter'


export class RedactPdf {

    private _blobRedactedService: BlobStorage
    private _blobService: BlobStorage

    constructor(blobService: BlobStorage, blobRedactedService: BlobStorage) {
        this._blobRedactedService = blobRedactedService
        this._blobService = blobService
    }

    public process = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const myBuffer : Buffer = Buffer.from(input.aggregatedResults.buffer)
        const pdfDoc = await PDFDocument.load(myBuffer)
        const pdfPage = pdfDoc.getPage(0)
        const ocrPageResults = input.aggregatedResults.ocr.pages[0]
        if (input?.aggregatedResults?.recognizePiiEntities?.items) { //batch mode has different json schema
            const piiResults = input.aggregatedResults.recognizePiiEntities.items[0].results.documents[0]
            const redacted = this._batchRedactPage(ocrPageResults, piiResults)
            const redactedPage: Buffer = await this._batchDrawRedactedPage(redacted, pdfPage, ocrPageResults, pdfDoc)
            const pdfWithPng: Buffer = await this._convertAndEmbed(redactedPage)
            await this._blobRedactedService.upload(pdfWithPng, input.filename)
        } else {
            const piiResults = input.aggregatedResults.recognizePiiEntities[0]
            const redacted = this._redactPage(ocrPageResults, piiResults)
            const redactedPage: Buffer = await this._drawRedactedPage(redacted, pdfPage, ocrPageResults, pdfDoc)
            const pdfWithPng: Buffer = await this._convertAndEmbed(redactedPage)
            await this._blobRedactedService.upload(pdfWithPng, input.filename)
        }

        const label = "redactPdf"

        input.aggregatedResults[label] = {
            outputLocation: `/translated-documents/${input.filename}`,
            status: "success"
        }

        input.resultsIndexes.push({ index: index, name: label, type: "redactPdf" })

        return {
            data: {
                outputLocation: `/translated-documents/${input.filename}`,
                status: "success"
            },
            index: index,
            type: "redactPdf",
            label: label,
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            aggregatedResults: input.aggregatedResults,
            resultsIndexes: input.resultsIndexes,
            id: input.id
        }
    }

    private _convertAndEmbed = async (redactedPage: Buffer): Promise<Buffer> => {
        var outputImages = await pdf2Png.pdfToPng(redactedPage);
        const newDoc = await PDFDocument.create()
        const newPage = newDoc.addPage()

        const pngImage = await newDoc.embedPng(outputImages[0].content);

        // Get the width/height of the PNG image scaled down to 50% of its original size
        const pngDims = pngImage.scale(1.0)

        newPage.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: pngDims.width,
            height: pngDims.height,
        })


        const newDocBytes = await newDoc.save()
        return Buffer.from(newDocBytes)
    }

    private _drawRedactedPage = async (redacted: any[], page: PDFPage, ocrPageResults, pdfDoc: PDFDocument): Promise<Buffer> => {
        const { width, height } = page.getSize()
        const ocrWidth = ocrPageResults.width
        const ocrHeight = ocrPageResults.height
        const yScale = height / ocrHeight
        const xScale = width / ocrWidth
        for (const r of redacted) {
            let minX = null
            let minY = null
            let maxX = null
            let maxY = null
            for (const p of r.polygon) {
                if (!minX) {
                    minX = p.x
                }
                if (!maxX) {
                    maxX = p.x
                }
                if (!minY) {
                    minY = p.y
                }
                if (!maxY) {
                    maxY = p.y
                }
                if (p.x > maxX) {
                    maxX = p.x
                }
                if (p.x < minX) {
                    minX = p.x
                }
                if (p.y > maxY) {
                    maxY = p.y
                }
                if (p.y < minY) {
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

    private _batchDrawRedactedPage = async (redacted: any[], page: PDFPage, ocrPageResults, pdfDoc: PDFDocument): Promise<Buffer> => {
        const { width, height } = page.getSize()
        const ocrWidth = ocrPageResults.width
        const ocrHeight = ocrPageResults.height
        const yScale = height / ocrHeight
        const xScale = width / ocrWidth
        for (const r of redacted) {
            let minX = Math.min(r.polygon[0], r.polygon[2], r.polygon[4], r.polygon[6])
            let minY = Math.min(r.polygon[1], r.polygon[3], r.polygon[5], r.polygon[7])
            let maxX = Math.max(r.polygon[0], r.polygon[2], r.polygon[4], r.polygon[6])
            let maxY = Math.max(r.polygon[1], r.polygon[3], r.polygon[5], r.polygon[7])

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

    private _batchRedactPage = (pageResults, piiResults): any[] => {
        let piiIndex = 0
        const redacted = []
        for (let i = 0; i < pageResults.words.length; i++) {
            if (piiResults.entities.length > piiIndex) {
                const pii = piiResults.entities[piiIndex]
                const piiSplit = pii.text.trim().split(' ')
                if (this._isRedactedEntity(pageResults.words, i, piiSplit)) {
                    const offset = i
                    for (; i < offset + piiSplit.length; i++) {
                        redacted.push(pageResults.words[i])
                    }
                    i = offset
                    const lastPii = piiResults.entities[piiIndex]
                    let nextPii
                    const entitiesLength = piiResults.entities.length
                    if (entitiesLength > piiIndex + 1) {
                        piiIndex++
                        nextPii = piiResults.entities[piiIndex]
                        if (lastPii.offset + lastPii.length >= nextPii.offset + nextPii.length) {
                            piiIndex++
                        }
                    } else {
                        break;
                    }
                }
            }
        }
        return redacted
    }

    private _redactPage = (pageResults, piiResults): any[] => {
        let piiIndex = 0
        const redacted = []
        for (let i = 0; i < pageResults.words.length; i++) {
            if (piiResults.results[0].entities.length > piiIndex) {
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
                            piiIndex++
                        }
                    } else {
                        break;
                    }
                }
            }
        }
        return redacted
    }

}







