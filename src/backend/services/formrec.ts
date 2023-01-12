import { DocumentAnalysisClient, AzureKeyCredential, AnalysisPoller, AnalyzedDocument, AnalyzeResult } from "@azure/ai-form-recognizer";
import { PrebuiltBusinessCardModel } from "./prebuilt/prebuilt-businessCard";
import { PrebuiltLayoutModel } from "./prebuilt/prebuilt-layout";
import { PrebuiltInvoiceModel } from "./prebuilt/prebuilt-invoice";
import { PrebuiltDocumentModel } from "./prebuilt/prebuilt-document";
import { PrebuiltIdDocumentModel } from "./prebuilt/prebuilt-idDocument";
import { PrebuiltReceiptModel } from "./prebuilt/prebuilt-receipt";
import { PrebuiltTaxUsW2Model } from "./prebuilt/prebuilt-tax.us.w2";
import { BpaServiceObject } from "../engine/types";
import { DB } from "./db";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import MessageQueue from "./messageQueue";

const _ = require('lodash')

export class FormRec {

    private _client : DocumentAnalysisClient
    private _apikey : string
    private _endpoint : string

    constructor(endpoint: string, apikey: string) {
        this._client = new DocumentAnalysisClient(
            endpoint,
            new AzureKeyCredential(apikey)
        )
        this._apikey = apikey
        this._endpoint = endpoint
    }
    
    public simplifyInvoice = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {

        const invoiceEntities = {}
        const items = {}
        let content = ""
        for(const document of input.aggregatedResults.invoice.documents){
            content += input.aggregatedResults.invoice.content
            for(const fieldKey of Object.keys(document.fields)){
                if(fieldKey === 'items'){
                    for(const item of document.fields.items.values){
                        for(const p of Object.keys(item.properties)){
                            items[p] = item.properties[p].value
                        }
                    }
                } else {
                    const newObject = document.fields[fieldKey]
                    invoiceEntities[fieldKey+"Content"] = newObject.content
                    invoiceEntities[fieldKey+"Kind"] = newObject.kind
                    invoiceEntities[fieldKey+"Confidence"] = newObject.confidence
                    invoiceEntities[fieldKey+"Value"] = newObject.value
                }
                
            }
        }
        const invoiceKVP : any = {}
        for(const kvp of input.aggregatedResults.invoice.keyValuePairs){
            try{
                const key = kvp.key.content
                const value = kvp.value.content
                const confidence = kvp.confidence
    
                if(invoiceKVP[key]){
                    invoiceKVP[key].push(value)
                } else {
                    invoiceKVP[key] = [value]
                }
            } catch(error){

            }
        }
        const label = "simplifyInvoice"
        const results = input.aggregatedResults
        results[label] = { fields : invoiceEntities, keyValuePairs : invoiceKVP, content : content }
        input.resultsIndexes.push({index : index, name : label, type : label})
        return {
            data : invoiceEntities,
            type : label,
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId : input.bpaId,
            label : label,
            aggregatedResults : results,
            resultsIndexes : input.resultsIndexes
        }

    }

    public generalDocument = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltDocumentModel, "generalDocument", index)
    }

    public layout = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltLayoutModel, "layout", index)
    }

    public prebuiltInvoice = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltInvoiceModel, "invoice", index)
    }

    public prebuiltBusinessCard = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltBusinessCardModel, "businessCard", index)
    }

    public prebuiltIdentity = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltIdDocumentModel, "identity", index)
    }

    public prebuiltReceipt = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltReceiptModel, "receipt", index)
    }

    public prebuiltTaxW2 = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltTaxUsW2Model, "taxw2", index)
    }

    public customFormrec = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, input.serviceSpecificConfig.modelId, "customFormRec", index)
    } 

    public generalDocumentAsync = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, PrebuiltDocumentModel, "generalDocument", index)
    }

    public layoutAsync = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, PrebuiltLayoutModel, "layout", index)
    }

    public prebuiltInvoiceAsync = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, PrebuiltInvoiceModel, "invoice", index)
    }

    public prebuiltBusinessCardAsync = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, PrebuiltBusinessCardModel, "businessCard", index)
    }

    public prebuiltIdentityAsync = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, PrebuiltIdDocumentModel, "identity", index)
    }

    public prebuiltReceiptAsync = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, PrebuiltReceiptModel, "receipt", index)
    }

    public prebuiltTaxW2Async = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocumentAsync(input, PrebuiltTaxUsW2Model, "taxw2", index)
    }

    public customFormrecAsync = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
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

    

    private _analyzeDocument = async (input : BpaServiceObject, modelId : any, label : string, index : number) : Promise<BpaServiceObject> => {
        const poller : AnalysisPoller<AnalyzeResult<AnalyzedDocument>> = await this._client.beginAnalyzeDocument(modelId, input.data)
        const result : AnalyzeResult<AnalyzedDocument> = await poller.pollUntilDone()
        const results = input.aggregatedResults
        results[label] = result
        input.resultsIndexes.push({index : index, name : label, type : label})
        return {
            data : result,
            type : label,
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId : input.bpaId,
            label : label,
            aggregatedResults : results,
            resultsIndexes : input.resultsIndexes
        }
    }

    private _analyzeDocumentAsync = async (input : BpaServiceObject, modelId : any, label : string, index : number) : Promise<BpaServiceObject> => {
        const poller : AnalysisPoller<AnalyzeResult<AnalyzedDocument>> = await this._client.beginAnalyzeDocument(modelId, input.data)
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