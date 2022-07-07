import { DocumentAnalysisClient, AzureKeyCredential, AnalysisPoller, LayoutResult, AnalyzedDocument, AnalyzeResult, GeneralDocumentResult, PrebuiltModels, AnalyzeDocumentOptions } from "@azure/ai-form-recognizer";
import { BpaServiceObject } from "../engine/types";

export class FormRec {

    private _client : DocumentAnalysisClient

    constructor(endpoint: string, apikey: string) {
        this._client = new DocumentAnalysisClient(
            endpoint,
            new AzureKeyCredential(apikey)
        )
    }

    public layout = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        const poller : AnalysisPoller<LayoutResult> = await this._client.beginExtractLayout(input.data)
        const layoutResult : LayoutResult = await poller.pollUntilDone()
        const results = input.aggregatedResults
        results["layout"] = layoutResult
        input.resultsIndexes.push({index : index, name : "layout", type : "layout"})
        return {
            data : layoutResult,
            type : "layout",
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId : input.bpaId,
            label : input.label,
            aggregatedResults : results,
            resultsIndexes : input.resultsIndexes
        }
    }


    public generalDocument = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        const poller : AnalysisPoller<GeneralDocumentResult> = await this._client.beginExtractGeneralDocument(input.data)
        const result : GeneralDocumentResult = await poller.pollUntilDone()
        const results = input.aggregatedResults
        results["generalDocument"] = result
        input.resultsIndexes.push({index : index, name : "generalDocument", type : "generalDocument"})
        return {
            data : result,
            type : "generalDocument",
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId : input.bpaId,
            label : input.label,
            aggregatedResults : results,
            resultsIndexes : input.resultsIndexes
        }
    }

    public prebuiltInvoice = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltModels.Invoice, "invoice", index)
    }

    public prebuiltBusinessCard = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltModels.BusinessCard, "businessCard", index)
    }

    public prebuiltIdentity = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltModels.IdentityDocument, "identity", index)
    }

    public prebuiltReceipt = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltModels.Receipt, "receipt", index)
    }

    public prebuiltTaxW2 = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltModels.TaxUsW2, "taxw2", index)
    }

    public customFormrec = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, input.serviceSpecificConfig.modelId, "customModel", index)
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

    public getReadPricing = (pages : number) : number => {
        const million = 1000000
        if(pages < (1*million)){
            return (pages * 1.5)/1000
        } else {
            return (pages * .60)/1000
        }
    }

    public getPrebuiltPricing = (pages : number) : number => {
        return (pages * 10)/1000
    }

    public getCustomPricing = (pages : number) : number => {
        const thousand = 1000000
        if(pages < (20*thousand)){
            return (pages * 40.0)/1000
        } else if (pages > (20*thousand) && pages < (100*thousand)){
            return (((pages - (20*thousand)) * 40.0)/1000) + 800
        } else if (pages > (100*thousand) && pages < (500*thousand)){
            return (((pages - (100*thousand)) * 32.50)/1000) + 3250
        } else if(pages > (500*thousand)){
            return (((pages - (500*thousand)) * 25.0)/1000) + 12500.0
        }
        throw new Error("error in Language Service getPricing")
    }
}