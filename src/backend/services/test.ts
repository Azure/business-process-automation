import { CosmosDB } from "../services/cosmosdb"
import { LanguageStudio } from "../services/language"
import { Speech } from '../services/speech'
import { Ocr } from "../services/ocr"
import { BpaServiceObject } from "../engine/types"
import { FormRec } from "../services/formrec"
import { Translate } from "../services/translate"
import { HuggingFace } from "../services/huggingface"
const _ = require('lodash')


const ocr = new Ocr(process.env.OCR_ENDPOINT, process.env.OCR_APIKEY)
const cosmosDb = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING, process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
const language = new LanguageStudio(process.env.LANGUAGE_STUDIO_PREBUILT_ENDPOINT, process.env.LANGUAGE_STUDIO_PREBUILT_APIKEY)
const speech = new Speech(process.env.SPEECH_SUB_KEY, process.env.SPEECH_SUB_REGION)
const formrec = new FormRec(process.env.FORMREC_ENDPOINT, process.env.FORMREC_APIKEY)
const translate = new Translate(process.env.TRANSLATE_ENDPOINT, process.env.TRANSLATE_APIKEY, process.env.TRANSLATE_REGION)
const huggingface = new HuggingFace(process.env.HUGGINGFACE_ENDPOINT)


export class Test {

    _services: any
    _textServices: any

    constructor() {
        this._services = [
            ocr.process,
            formrec.generalDocument,
            formrec.layout,
            formrec.prebuiltBusinessCard,
            formrec.prebuiltIdentity,
            formrec.prebuiltInvoice,
            formrec.prebuiltInvoice,
            formrec.prebuiltReceipt,
            formrec.prebuiltTaxW2
        ]

        this._textServices = [
            language.analyzeSentiment,
            language.extractKeyPhrases,
            language.extractSummary,
            language.recognizeEntities,
            language.recognizeLinkedEntities,
            language.recognizePiiEntities,
            translate.translate,
            huggingface.process
        ]
    }

    public process = async (input: BpaServiceObject, index : number): Promise<BpaServiceObject> => {
        //const output = []
        let requestObject : BpaServiceObject = _.cloneDeep(input)
        for (const testService of this._services) {
            let result = "success"
            try{
                const out : BpaServiceObject = await testService(requestObject)
                requestObject.aggregatedResults = _.cloneDeep(out.aggregatedResults)
            } catch (err){
                result = JSON.stringify(err)
            }
            //output.push(result)
        }

        const ocrResult : BpaServiceObject = await ocr.process(input, index)
        requestObject.data = ocrResult.data
        for (const testService of this._textServices) {
            let result = "success"
            try{
                const out : BpaServiceObject = await testService(requestObject)
                requestObject.aggregatedResults = _.cloneDeep(out.aggregatedResults)
                requestObject.data = ocrResult.data
            } catch (err){
                result = JSON.stringify(err)
            }
            //output.push(result)
        }

        return requestObject
    }
}