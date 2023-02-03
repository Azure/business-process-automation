import { DocumentAnalysisClient, AzureKeyCredential, AnalysisPoller, AnalyzedDocument, AnalyzeResult } from "@azure/ai-form-recognizer";
import { PrebuiltBusinessCardModel } from "./prebuilt/prebuilt-businessCard";
import { PrebuiltLayoutModel } from "./prebuilt/prebuilt-layout";
import { PrebuiltInvoiceModel } from "./prebuilt/prebuilt-invoice";
import { PrebuiltDocumentModel } from "./prebuilt/prebuilt-document";
import { PrebuiltIdDocumentModel } from "./prebuilt/prebuilt-idDocument";
import { PrebuiltReceiptModel } from "./prebuilt/prebuilt-receipt";
import { PrebuiltTaxUsW2Model } from "./prebuilt/prebuilt-tax.us.w2";
import { PrebuiltReadModel } from "./prebuilt/prebuilt-read";
import { BpaServiceObject } from "../engine/types";
import { DB } from "./db";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import MessageQueue from "./messageQueue";

const _ = require('lodash')

export class FormRec {

    private _client: DocumentAnalysisClient
    private _apikey: string
    private _endpoint: string
    private _containerReadEndpoint : string

    constructor(endpoint: string, apikey: string, containerReadEndpoint ?: string) {
        this._client = new DocumentAnalysisClient(
            endpoint,
            new AzureKeyCredential(apikey)
        )
        this._apikey = apikey
        this._endpoint = endpoint
        this._containerReadEndpoint = containerReadEndpoint
    }
    private _delay = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public readContainer = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        console.log("read api 3.2 from container")
        const url = `${this._containerReadEndpoint}/vision/v3.2/read/analyze`
        const headers: AxiosRequestConfig = {
            headers: {
                "accept": "*/*",
                "Content-Type": "application/pdf"
            }
        }
        const out = await axios.post(url, input.data, headers)
        let status = 'processing'
        let statusResponse: any = {}
        while (status !== 'succeeded' && status !== 'failed') {
            statusResponse = await axios.get(out.headers['operation-location'])
            status = statusResponse.data.status
            if (status === 'failed') {
                throw new Error(statusResponse)
            }
            if (status !== 'succeeded') {
                await this._delay(2000)
            }
        }
        const label = "ocrContainer"
        const results = input.aggregatedResults
        results[label] = statusResponse.data.analyzeResult
        input.resultsIndexes.push({ index: index, name: label, type: label })
        return {
            data: statusResponse.data.analyzeResult,
            type: label,
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            label: label,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes
        }


    }

    public readContainerAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        console.log("read api 3.2 from container (batch mode)")
        const url = `${this._containerReadEndpoint}/vision/v3.2/read/analyze`
        const headers: AxiosRequestConfig = {
            headers: {
                "accept": "*/*",
                "Content-Type": "application/pdf"
            }
        }
        const out = await axios.post(url, input.data, headers)
        const label = "ocrContainer"
        input.aggregatedResults[label] = {
            location: out.headers['operation-location'],
            filename: input.filename
        }
        return {
            index: index,
            type: "async transaction",
            label: label,
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            aggregatedResults: input.aggregatedResults,
            resultsIndexes: input.resultsIndexes
        }
    }


    public simplifyInvoice = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        const invoiceEntities = {}
        const items = []
        let content = ""
        for (const document of input.aggregatedResults.invoice.documents) {
            content += input.aggregatedResults.invoice.content
            for (const fieldKey of Object.keys(document.fields)) {
                if (fieldKey === 'items') {
                    for (const item of document.fields.items.values) {
                        let _item: any = {}
                        for (const p of Object.keys(item.properties)) {
                            _item[p] = item.properties[p].content
                        }
                        items.push(_item)
                    }
                } else {
                    const newObject = document.fields[fieldKey]
                    invoiceEntities[fieldKey] = newObject.content
                }

            }
        }
        const invoiceKVP: any = {}
        for (const kvp of input.aggregatedResults.invoice.keyValuePairs) {
            try {
                const key = kvp.key.content
                const value = kvp.value.content
                const confidence = kvp.confidence

                if (invoiceKVP[key]) {
                    invoiceKVP[key].push(value)
                } else {
                    invoiceKVP[key] = [value]
                }
            } catch (error) {

            }
        }
        const label = "simplifyInvoice"
        const results = input.aggregatedResults
        results[label] = { fields: invoiceEntities, keyValuePairs: invoiceKVP, items: items, content: content }
        input.resultsIndexes.push({ index: index, name: label, type: label })
        return {
            data: invoiceEntities,
            type: label,
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            label: label,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes
        }

    }

    public ocrContainerToText = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        let outString = ""
        for (const page of input.data.readResults) {
            for (const line of page.lines) {
                outString += " " + line.content
            }
        }

        const label = "ocrContainerToText"
        const results = input.aggregatedResults
        results[label] = outString.replace('[A-Za-z0-9 *!$%&()?<>{}]+', '')
        input.resultsIndexes.push({ index: index, name: label, type: "text" })

        return {
            data: outString.replace('[A-Za-z0-9 *!$%&()?<>{}]+', ''),
            type: "text",
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            label: label,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes
        }
    }

    public ocrToText = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        let outString = ""
        for (const page of input.data.pages) {
            for (const line of page.lines) {
                outString += " " + line.content
            }
        }

        const label = "ocrToText"
        const results = input.aggregatedResults
        results[label] = outString.replace('[A-Za-z0-9 *!$%&()?<>{}]+', '')
        input.resultsIndexes.push({ index: index, name: label, type: "text" })

        return {
            data: outString.replace('[A-Za-z0-9 *!$%&()?<>{}]+', ''),
            type: "text",
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            label: label,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes
        }
    }

    public readDocument = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltReadModel, "ocr", index)
    }

    public generalDocument = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltDocumentModel, "generalDocument", index)
    }

    public layout = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltLayoutModel, "layout", index)
    }

    public prebuiltInvoice = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltInvoiceModel, "invoice", index)
    }

    public prebuiltBusinessCard = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltBusinessCardModel, "businessCard", index)
    }

    public prebuiltIdentity = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltIdDocumentModel, "identity", index)
    }

    public prebuiltReceipt = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltReceiptModel, "receipt", index)
    }

    public prebuiltTaxW2 = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltTaxUsW2Model, "taxw2", index)
    }

    public customFormrec = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, input.serviceSpecificConfig.modelId, "customFormRec", index)
    }

    public readDocumentAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, PrebuiltReadModel, "ocr", index)
    }

    public generalDocumentAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, PrebuiltDocumentModel, "generalDocument", index)
    }

    public layoutAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, PrebuiltLayoutModel, "layout", index)
    }

    public prebuiltInvoiceAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, PrebuiltInvoiceModel, "invoice", index)
    }

    public prebuiltBusinessCardAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, PrebuiltBusinessCardModel, "businessCard", index)
    }

    public prebuiltIdentityAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, PrebuiltIdDocumentModel, "identity", index)
    }

    public prebuiltReceiptAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, PrebuiltReceiptModel, "receipt", index)
    }

    public prebuiltTaxW2Async = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, PrebuiltTaxUsW2Model, "taxw2", index)
    }

    public customFormrecAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, input.serviceSpecificConfig.modelId, "customFormRec", index)
    }

    public processAsync = async (mySbMsg: any, db: DB, mq: MessageQueue): Promise<void> => {


        const axiosParams: AxiosRequestConfig = {
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": this._apikey
            }
        }
        let httpResult = 200
        let axiosGetResp: AxiosResponse

        axiosGetResp = await axios.get(mySbMsg.aggregatedResults[mySbMsg.label].location, axiosParams)
        httpResult = axiosGetResp.status
        if ((axiosGetResp?.data?.status && axiosGetResp.data.status === 'Failed') || (httpResult <= 200 && httpResult >= 299)) {
            mySbMsg.type = 'async failed'
            mySbMsg.data = axiosGetResp.data
            await db.create(mySbMsg)
            throw new Error(`failed : ${JSON.stringify(axiosGetResp.data)}`)
        } else if (axiosGetResp?.data?.status && axiosGetResp.data.status === 'succeeded') {
            mySbMsg.type = 'async completion'
            mySbMsg.aggregatedResults[mySbMsg.label] = axiosGetResp.data.analyzeResult
            mySbMsg.resultsIndexes.push({ index: mySbMsg.index, name: mySbMsg.label, type: mySbMsg.label })
            mySbMsg.type = mySbMsg.label
            mySbMsg.index = mySbMsg.index + 1
            mySbMsg.data = axiosGetResp.data.analyzeResult

            const dbout = await db.create(mySbMsg)
            mySbMsg.dbId = dbout.id
            mySbMsg.aggregatedResults[mySbMsg.label] = dbout.id
            mySbMsg.data = dbout.id

            await mq.sendMessage(mySbMsg)
        } else {
            console.log('do nothing')
            await mq.scheduleMessage(mySbMsg, 10000)
        }
    }

    private _analyzeDocument = async (input: BpaServiceObject, modelId: any, label: string, index: number): Promise<BpaServiceObject> => {
        const poller: AnalysisPoller<AnalyzeResult<AnalyzedDocument>> = await this._client.beginAnalyzeDocument(modelId, input.data)
        const result: AnalyzeResult<AnalyzedDocument> = await poller.pollUntilDone()
        const results = input.aggregatedResults
        results[label] = result
        input.resultsIndexes.push({ index: index, name: label, type: label })
        return {
            data: result,
            type: label,
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            label: label,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes
        }
    }

    private _analyzeDocumentAsync = async (input: BpaServiceObject, modelId: any, label: string, index: number): Promise<BpaServiceObject> => {
        const poller: AnalysisPoller<AnalyzeResult<AnalyzedDocument>> = await this._client.beginAnalyzeDocument(modelId, input.data)
        input.aggregatedResults[label] = {
            location: JSON.parse(poller.toString())["operationLocation"],
            filename: input.filename
        }

        return {
            index: index,
            type: "async transaction",
            label: label,
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            aggregatedResults: input.aggregatedResults,
            resultsIndexes: input.resultsIndexes
        }
    }


}