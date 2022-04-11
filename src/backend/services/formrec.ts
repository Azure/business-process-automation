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

    public layout = async (input : BpaServiceObject) : Promise<BpaServiceObject> => {
        const poller : AnalysisPoller<LayoutResult> = await this._client.beginExtractLayout(input.data)
        const layoutResult : LayoutResult = await poller.pollUntilDone()
        return {
            data : layoutResult,
            type : "layout",
            projectName : input.projectName,
            bpaId : input.bpaId,
            label : input.label
        }
    }


    public generalDocument = async (input : BpaServiceObject) : Promise<BpaServiceObject> => {
        const poller : AnalysisPoller<GeneralDocumentResult> = await this._client.beginExtractGeneralDocument(input.data)
        const result : GeneralDocumentResult = await poller.pollUntilDone()
        return {
            data : result,
            type : "generalDocument",
            projectName : input.projectName,
            bpaId : input.bpaId,
            label : input.label
        }
    }

    public prebuiltInvoice = async (input : BpaServiceObject) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltModels.Invoice, "invoice")
    }

    public prebuiltBusinessCard = async (input : BpaServiceObject) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltModels.BusinessCard, "businessCard")
    }

    public prebuiltIdentity = async (input : BpaServiceObject) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltModels.IdentityDocument, "identity")
    }

    public prebuiltReceipt = async (input : BpaServiceObject) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltModels.Receipt, "receipt")
    }

    public prebuiltTaxW2 = async (input : BpaServiceObject) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, PrebuiltModels.TaxUsW2, "taxw2")
    }

    public customFormrec = async (input : BpaServiceObject) : Promise<BpaServiceObject> => {
        return this._analyzeDocument(input, input.serviceSpecificConfig.modelId, "customModel")
    } 

    private _analyzeDocument = async (input : BpaServiceObject, modelId : any, label : string) : Promise<BpaServiceObject> => {
        const poller : AnalysisPoller<AnalyzeResult<AnalyzedDocument>> = await this._client.beginAnalyzeDocument(modelId, input.data)
        const result : AnalyzeResult<AnalyzedDocument> = await poller.pollUntilDone()
        return {
            data : result,
            type : label,
            projectName : input.projectName,
            bpaId : input.bpaId,
            label : input.label
        }
    }
}