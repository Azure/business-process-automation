import { CosmosDB } from "../services/db"
import { LanguageStudio } from "../services/language"
import { Speech } from '../services/speech'
import { BpaService } from "./types"
import { FormRec } from "../services/formrec"
import { Translate } from "../services/translate"
import { HuggingFace } from "../services/huggingface"
import { Test } from "../services/test"
import { Preprocess } from "../services/preprocess"
import { DocumentTranslation } from "../services/documentTranslation"
import { AutoMlNer } from "../services/automlner"
import { ChangeOutput } from "../services/changeOutput"
import { BlobStorage } from "../services/storage"
import { ContentModerator } from "../services/contentModerator"
import { Xml } from "../services/xml"
import { VideoIndexer } from "../services/videoIndexer"
import { TableParser } from "../services/tableParser"
import { OpenAI } from "../services/openai"
import { SpliceDocument } from "../services/spliceDocument"

const changeOutput = new ChangeOutput()
const blob = new BlobStorage(process.env.AzureWebJobsStorage, process.env.BLOB_STORAGE_CONTAINER)
const cosmosDb = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING,process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
const language = new LanguageStudio(process.env.LANGUAGE_STUDIO_PREBUILT_ENDPOINT, process.env.LANGUAGE_STUDIO_PREBUILT_APIKEY)
const speech = new Speech(process.env.SPEECH_SUB_KEY,process.env.SPEECH_SUB_REGION,process.env.AzureWebJobsStorage, process.env.BLOB_STORAGE_CONTAINER,process.env.COSMOSDB_CONNECTION_STRING,process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
const formrec = new FormRec(process.env.FORMREC_ENDPOINT, process.env.FORMREC_APIKEY, process.env.FORMREC_CONTAINER_READ_ENDPOINT)
const translate = new Translate(process.env.TRANSLATE_ENDPOINT, process.env.TRANSLATE_APIKEY, process.env.TRANSLATE_REGION)
const huggingface = new HuggingFace(process.env.HUGGINGFACE_ENDPOINT)
const preprocess = new Preprocess(process.env.HUGGINGFACE_ENDPOINT)
const documentTranslation = new DocumentTranslation(process.env.BLOB_STORAGE_ACCOUNT_NAME, process.env.BLOB_STORAGE_ACCOUNT_KEY, process.env.DOCUMENT_TRANSLATION_ENDPOINT, process.env.DOCUMENT_TRANSLATION_KEY)
const automlNer = new AutoMlNer(process.env.AUTOML_NER_ENDPOINT, process.env.AUTOML_NER_APIKEY)
const test = new Test()
const contentModerator = new ContentModerator(process.env.CONTENT_MODERATOR_ENDPOINT,process.env.CONTENT_MODERATOR_KEY)
const xml = new Xml()
const videoIndexer = new VideoIndexer(process.env.AzureWebJobsStorage, process.env.BLOB_STORAGE_CONTAINER)
const tableParser = new TableParser(cosmosDb)
const openaiText = new OpenAI(process.env.OPENAI_ENDPOINT, process.env.OPENAI_KEY, process.env.OPENAI_DEPLOYMENT_TEXT)
const openaiSearchDoc = new OpenAI(process.env.OPENAI_ENDPOINT, process.env.OPENAI_KEY, process.env.OPENAI_DEPLOYMENT_SEARCH_DOC)
const splicedDocument = new SpliceDocument(blob)

const spliceDocumentService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf"],
    outputTypes: ["pdf"],
    name: "spliceDocument",
    process: splicedDocument.process,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const openaiEmbeddingsService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["text"],
    outputTypes: ["openaiEmbeddings"],
    name: "openaiEmbeddings",
    process: openaiSearchDoc.processEmbeddings,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const openaiGenericService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["text"],
    outputTypes: ["openaiGeneric"],
    name: "openaiGeneric",
    process: openaiText.processGeneric,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const openaiSummarizeService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["text"],
    outputTypes: ["openaiSummarize"],
    name: "openaiSummarize",
    process: openaiText.process,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const ocrToTextService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["ocr"],
    outputTypes: ["text"],
    name: "ocrToText",
    process: formrec.ocrToText,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const ocrContainerToTextService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["ocrContainer"],
    outputTypes: ["text"],
    name: "ocrContainerToText",
    process: formrec.ocrContainerToText,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const simplifyInvoiceService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["invoice"],
    outputTypes: ["simpleInvoice"],
    name: "simplifyInvoice",
    process: formrec.simplifyInvoice,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const tableParserService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["customFormRec","layout","generalDocument"],
    outputTypes: ["tableParser"],
    name: "tableParser",
    process: tableParser.process,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const videoIndexerService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: [ "flv",
    "mxf",
    "gxf",
    "mpg",
    "wmv",
    "asf",
    "avi",
    "mp4",
    "mov",
    "isma",
    "ismv",
    "mkv"],
    outputTypes: ["videoIndexer"],
    name: "videoIndexer",
    process: videoIndexer.processBatch,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const contentModeratorImageService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: [ "bmp","jpg","tiff","gif"],
    outputTypes: ["contentModeratorImage"],
    name: "contentModeratorImage",
    process: contentModerator.image,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const contentModeratorTextService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["text"],
    outputTypes: ["contentModeratorText"],
    name: "contentModeratorText",
    process: contentModerator.text,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const toTxtService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["text"],
    outputTypes: ["text"],
    name: "totxt",
    process: blob.toTxt,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}


// const copyService : BpaService = {
//     bpaServiceId : "abc123",
//     inputTypes: ["pdf"],
//     outputTypes: ["pdf"],
//     name: "copy",
//     process: blob.conditionalCopy,
//     serviceSpecificConfig: {


const changeOutputService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["any"],
    outputTypes: ["changeOutput"],
    name: "changeOutput",
    process: changeOutput.process,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const automlNerService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["text"],
    outputTypes: ["automlNer"],
    name: "automlNer",
    process: automlNer.process,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const translateService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["text"],
    outputTypes: ["text"],
    name: "translate",
    process: translate.translate,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const testService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["test"],
    name: "test",
    process: test.process,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}


const layout : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["layout"],
    name: "layout",
    process: formrec.layout,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const layoutBatch : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["layout"],
    name: "layoutBatch",
    process: formrec.layoutAsync,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const generalDocumentBatch : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["generalDocument"],
    name: "generalDocumentBatch",
    process: formrec.generalDocumentAsync,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const prebuiltBusinessCardBatch : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["prebuiltBusinessCard"],
    name: "prebuiltBusinessCardBatch",
    process: formrec.prebuiltBusinessCardAsync,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}


const prebuiltIdentityBatch : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["prebuiltIdentity"],
    name: "prebuiltIdentityBatch",
    process: formrec.prebuiltIdentityAsync,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const prebuiltInvoiceBatch : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["prebuiltInvoice"],
    name: "prebuiltInvoiceBatch",
    process: formrec.prebuiltInvoiceAsync,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const prebuiltReceiptBatch : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["prebuiltReceipt"],
    name: "prebuiltReceiptBatch",
    process: formrec.prebuiltReceiptAsync,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const prebuiltTaxW2Batch : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["prebuiltTaxW2"],
    name: "prebuiltTaxW2Batch",
    process: formrec.prebuiltTaxW2Async,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}


const customFormRecBatch : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["customFormRec"],
    name: "customFormRecBatch",
    process: formrec.customFormrecAsync,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const generalDocument : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["generalDocument"],
    name: "generalDocument",
    process: formrec.generalDocument,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const prebuiltBusinessCard : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["prebuiltBusinessCard"],
    name: "prebuiltBusinessCard",
    process: formrec.prebuiltBusinessCard,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}


const prebuiltIdentity : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["prebuiltIdentity"],
    name: "prebuiltIdentity",
    process: formrec.prebuiltIdentity,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const prebuiltInvoice : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["prebuiltInvoice"],
    name: "prebuiltInvoice",
    process: formrec.prebuiltInvoice,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const prebuiltReceipt : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["prebuiltReceipt"],
    name: "prebuiltReceipt",
    process: formrec.prebuiltReceipt,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const prebuiltTaxW2 : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["prebuiltTaxW2"],
    name: "prebuiltTaxW2",
    process: formrec.prebuiltTaxW2,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}


const customFormRec : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","tiff","tif","jpeg"],
    outputTypes: ["customFormRec"],
    name: "customFormRec",
    process: formrec.customFormrec,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}


const sttService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["wav","mp3"],
    outputTypes: ["text"],
    name: "stt",
    process: speech.process,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const sttBatchService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["wav","mp3"],
    outputTypes: ["text"],
    name: "sttBatch",
    process: speech.processBatch,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const ocrContainerBatchService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg"],
    outputTypes: ["ocrContainer"],
    name: "ocrContainerBatch",
    process: formrec.readContainerAsync,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const ocrContainerService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg"],
    outputTypes: ["ocrContainer"],
    name: "ocrContainer",
    process: formrec.readContainer,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const ocrService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg"],
    outputTypes: ["ocr"],
    name: "ocr",
    process: formrec.readDocument,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const ocrBatchService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg"],
    outputTypes: ["ocr"],
    name: "ocrBatch",
    process: formrec.readDocumentAsync,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const summaryToText : BpaService = {
    inputTypes: ["extractSummary"],
    outputTypes: ["text"],
    name: "summaryToText",
    bpaServiceId: "abc123",
    process: language.summaryToText,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const extractSummaryBatch : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["extractSummary"],
    name: "extractSummaryBatch",
    bpaServiceId: "abc123",
    process: language.extractSummaryAsync,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const analyzeSentimentBatch : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["analyzeSentiment"],
    name: "analyzeSentimentBatch",
    bpaServiceId: "abc123",
    process: language.analyzeSentimentAsync,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const extractKeyPhrasesBatch : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["extractKeyPhrases"],
    name: "extractKeyPhrasesBatch",
    bpaServiceId: "abc123",
    process: language.extractKeyPhrasesAsync,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}
const multiCategoryClassifyBatch : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["multiCategoryClassify"],
    name: "multiCategoryClassifyBatch",
    bpaServiceId: "abc123",
    process: language.multiCategoryClassifyAsync,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}
const recognizeCustomEntitiesBatch : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["recognizeCustomEntities"],
    name: "recognizeCustomEntitiesBatch",
    bpaServiceId: "abc123",
    process: language.recognizeCustomEntitiesAsync,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}
const recognizeEntitiesBatch : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["recognizeEntities"],
    name: "recognizeEntitiesBatch",
    bpaServiceId: "abc123",
    process: language.recognizeEntitiesAsync,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const recognizeLinkedEntitiesBatch : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["recognizeLinkedEntities"],
    name: "recognizeLinkedEntitiesBatch",
    bpaServiceId: "abc123",
    process: language.recognizeLinkedEntitiesAsync,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const recognizePiiEntitiesBatch : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["recognizePiiEntities"],
    name: "recognizePiiEntitiesBatch",
    bpaServiceId: "abc123",
    process: language.recognizePiiEntitiesAsync,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const singleCategoryClassifyBatch : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["singleCategoryClassify"],
    name: "singleCategoryClassifyBatch",
    bpaServiceId: "abc123",
    process: language.singleCategoryClassifyAsync,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const healthCareServiceBatch : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["healthCareResults"],
    name: "healthCareBatch",
    bpaServiceId: "abc123",
    process: language.healthCareAsync,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const extractSummary : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["extractSummary"],
    name: "extractSummary",
    bpaServiceId: "abc123",
    process: language.extractSummary,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const analyzeSentiment : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["analyzeSentiment"],
    name: "analyzeSentiment",
    bpaServiceId: "abc123",
    process: language.analyzeSentiment,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const extractKeyPhrases : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["extractKeyPhrases"],
    name: "extractKeyPhrases",
    bpaServiceId: "abc123",
    process: language.extractKeyPhrases,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}
const multiCategoryClassify : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["multiCategoryClassify"],
    name: "multiCategoryClassify",
    bpaServiceId: "abc123",
    process: language.multiCategoryClassify,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}
const recognizeCustomEntities : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["recognizeCustomEntities"],
    name: "recognizeCustomEntities",
    bpaServiceId: "abc123",
    process: language.recognizeCustomEntities,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}
const recognizeEntities : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["recognizeEntities"],
    name: "recognizeEntities",
    bpaServiceId: "abc123",
    process: language.recognizeEntities,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const recognizeLinkedEntities : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["recognizeLinkedEntities"],
    name: "recognizeLinkedEntities",
    bpaServiceId: "abc123",
    process: language.recognizeLinkedEntities,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const recognizePiiEntities : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["recognizePiiEntities"],
    name: "recognizePiiEntities",
    bpaServiceId: "abc123",
    process: language.recognizePiiEntities,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const singleCategoryClassify : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["singleCategoryClassify"],
    name: "singleCategoryClassify",
    bpaServiceId: "abc123",
    process: language.singleCategoryClassify,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const healthCareService : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["healthCareResults"],
    name: "healthCare",
    bpaServiceId: "abc123",
    process: language.healthCare,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const preprocessService : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["preprocess"],
    name: "preprocess",
    bpaServiceId: "abc123",
    process: preprocess.process,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const huggingFaceNER : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["huggingFaceNER"],
    name: "huggingFaceNER",
    bpaServiceId: "abc123",
    process: huggingface.process,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const documentTranslationService : BpaService = {
    inputTypes: ["pdf"],
    outputTypes: ["pdf"],
    name: "documentTranslation",
    bpaServiceId: "abc123",
    process: documentTranslation.process,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const xmlToJsonService : BpaService = {
    inputTypes: ["xml"],
    outputTypes: ["xmlToJson"],
    name: "xmlToJson",
    bpaServiceId: "abc123",
    process: xml.process,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}



export const serviceCatalog = {
    // "copy" : copyService,
    "spliceDocument" : spliceDocumentService,
    "simplifyInvoice" : simplifyInvoiceService,
    "ocrService" : ocrService, 
    "ocrContainerService" : ocrContainerService, 
    "ocrContainerBatchService" : ocrContainerBatchService, 
    "ocrBatchService" : ocrBatchService,
    "ocrToText" : ocrToTextService,
    "ocrContainerToText" : ocrContainerToTextService,
    "extractSummary" : extractSummary,
    "analyzeSentiment" : analyzeSentiment,
    "extractKeyPhrases" : extractKeyPhrases,
    "multiCategoryClassify" : multiCategoryClassify,
    "recognizeCustomEntities" : recognizeCustomEntities,
    "recognizeEntities" : recognizeEntities,
    "recognizeLinkedEntities" : recognizeLinkedEntities,
    "recognizePiiEntities" : recognizePiiEntities,
    "singleCategoryClassify" : singleCategoryClassify,
    "extractSummaryBatch" : extractSummaryBatch,
    "analyzeSentimentBatch" : analyzeSentimentBatch,
    "extractKeyPhrasesBatch" : extractKeyPhrasesBatch,
    "multiCategoryClassifyBatch" : multiCategoryClassifyBatch,
    "recognizeCustomEntitiesBatch" : recognizeCustomEntitiesBatch,
    "recognizeEntitiesBatch" : recognizeEntitiesBatch,
    "recognizeLinkedEntitiesBatch" : recognizeLinkedEntitiesBatch,
    "recognizePiiEntitiesBatch" : recognizePiiEntitiesBatch,
    "singleCategoryClassifyBatch" : singleCategoryClassifyBatch,
    "summaryToText" : summaryToText,
    "sttService" : sttService,
    "sttBatchService" : sttBatchService,
    "translate" : translateService,
    "layout" : layout,
    "generalDocument" : generalDocument,
    "prebuiltBusinessCard" : prebuiltBusinessCard,
    "prebuiltIdentity" : prebuiltIdentity,
    "prebuiltInvoice" : prebuiltInvoice,
    "prebuiltReceipt" : prebuiltReceipt,
    "prebuiltTaxW2" : prebuiltTaxW2,
    "customFormRec" : customFormRec,
    "layoutBatch" : layoutBatch,
    "generalDocumentBatch" : generalDocumentBatch,
    "prebuiltBusinessCardBatch" : prebuiltBusinessCardBatch,
    "prebuiltIdentityBatch" : prebuiltIdentityBatch,
    "prebuiltInvoiceBatch" : prebuiltInvoiceBatch,
    "prebuiltReceiptBatch" : prebuiltReceiptBatch,
    "prebuiltTaxW2Batch" : prebuiltTaxW2Batch,
    "customFormRecBatch" : customFormRecBatch,
    
    "huggingFaceNER" : huggingFaceNER,
    "preprocess" : preprocessService,
    "testService" : testService,
    "healthCare" : healthCareService,
    "healthCareBatch" : healthCareServiceBatch,
    "documentTranslation" : documentTranslationService,
    "automlNer" : automlNerService,
    "changeOutput" : changeOutputService,
    "totxt" : toTxtService,
    "contentModeratorText" : contentModeratorTextService,
    "contentModeratorImage" : contentModeratorImageService,
    "xmlToJson" : xmlToJsonService,
    "videoIndexer" : videoIndexerService,
    "tableParser" : tableParserService,
    "openaiSummarize" : openaiSummarizeService,
    "openaiGeneric" : openaiGenericService,
    "openaiEmbeddings" : openaiEmbeddingsService
}

