import { DocumentAnalysisClient, AzureKeyCredential, AnalysisPoller, AnalyzedDocument, AnalyzeResult } from "@azure/ai-form-recognizer";
import { PrebuiltBusinessCardModel } from "./prebuilt/prebuilt-businessCard";
import { PrebuiltLayoutModel } from "./prebuilt/prebuilt-layout";
import { PrebuiltInvoiceModel } from "./prebuilt/prebuilt-invoice";
import { PrebuiltDocumentModel } from "./prebuilt/prebuilt-document";
import { PrebuiltIdDocumentModel } from "./prebuilt/prebuilt-idDocument";
import { PrebuiltReceiptModel } from "./prebuilt/prebuilt-receipt";
import { PrebuiltTaxUsW2Model } from "./prebuilt/prebuilt-tax.us.w2";
import { BpaServiceObject } from "../engine/types";
const _ = require('lodash')

export class FormRec {

    private _client : DocumentAnalysisClient

    constructor(endpoint: string, apikey: string) {
        this._client = new DocumentAnalysisClient(
            endpoint,
            new AzureKeyCredential(apikey)
        )
    }
    
    public simplifyInvoice = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {

        const invoiceEntities = {}
        for(const document of input.aggregatedResults.invoice.documents){
            for(const fieldKey of Object.keys(document.fields)){
                const newObject = document.fields[fieldKey]
                invoiceEntities[fieldKey+"Content"] = newObject.content
                invoiceEntities[fieldKey+"Kind"] = newObject.kind
                invoiceEntities[fieldKey+"Confidence"] = newObject.confidence
                invoiceEntities[fieldKey+"Value"] = newObject.value
            }
        }
        const label = "simplifyInvoice"
        const results = input.aggregatedResults
        results[label] = invoiceEntities
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


}