import { DocumentAnalysisClient, AzureKeyCredential, AnalysisPoller, AnalyzedDocument, AnalyzeResult } from "@azure/ai-form-recognizer";
import { PrebuiltBusinessCardModel } from "./prebuilt/prebuilt-businessCard";
import { PrebuiltLayoutModel } from "./prebuilt/prebuilt-layout";
import { PrebuiltInvoiceModel } from "./prebuilt/prebuilt-invoice";
import { PrebuiltDocumentModel } from "./prebuilt/prebuilt-document";
import { PrebuiltIdDocumentModel } from "./prebuilt/prebuilt-idDocument";
import { PrebuiltReceiptModel } from "./prebuilt/prebuilt-receipt";
import { PrebuiltTaxUsW2Model } from "./prebuilt/prebuilt-tax.us.w2";

import { BpaServiceObject } from "../engine/types";

export class FormRec {

    private _client : DocumentAnalysisClient

    constructor(endpoint: string, apikey: string) {
        this._client = new DocumentAnalysisClient(
            endpoint,
            new AzureKeyCredential(apikey)
        )
    }
    

    // public layout = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
    //     const poller : AnalysisPoller<LayoutResult> = await this._client.beginExtractLayout(input.data)
    //     const layoutResult : LayoutResult = await poller.pollUntilDone()
    //     const results = input.aggregatedResults
    //     results["layout"] = layoutResult
    //     input.resultsIndexes.push({index : index, name : "layout", type : "layout"})
    //     return {
    //         data : layoutResult,
    //         type : "layout",
    //         filename: input.filename,
    //         pipeline: input.pipeline,
    //         bpaId : input.bpaId,
    //         label : input.label,
    //         aggregatedResults : results,
    //         resultsIndexes : input.resultsIndexes
    //     }
    // }


    // public generalDocument = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
    //     const poller : AnalysisPoller<GeneralDocumentResult> = await this._client.beginExtractGeneralDocument(input.data)
    //     const result : GeneralDocumentResult = await poller.pollUntilDone()
    //     const results = input.aggregatedResults
    //     results["generalDocument"] = result
    //     input.resultsIndexes.push({index : index, name : "generalDocument", type : "generalDocument"})
    //     return {
    //         data : result,
    //         type : "generalDocument",
    //         filename: input.filename,
    //         pipeline: input.pipeline,
    //         bpaId : input.bpaId,
    //         label : input.label,
    //         aggregatedResults : results,
    //         resultsIndexes : input.resultsIndexes
    //     }
    // }

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


}