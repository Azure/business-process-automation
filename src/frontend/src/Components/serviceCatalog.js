import pdf from '../images/pdf.svg'
import sentiment from '../images/sentimentDemoLogo.svg'
import detectLanguage from '../images/detectLanguageDemoLogo.svg'
import ner from '../images/nerDemoLogo.svg'
import ocr from '../images/ocrLogo.svg'
import summarize from '../images/summarizationDemoLogo.svg'
import tts from '../images/textToSpeech.svg'
import pii from '../images/piiDemoLogo.svg'
import keyphrase from '../images/keyPhrasesDemoLogo.svg'
import linkedEntities from '../images/linkedEntitiesDemoLogo.svg'
import customNER from '../images/customEntityExtractionLogo.svg'
import customClassification from '../images/customEntityExtractionLogo.svg'
import customform from '../images/customform.svg'
import generaldoc from '../images/customform.svg'
import idcard from '../images/idcard.svg'
import invoice from '../images/invoice.svg'
import layoutLogo from '../images/layoutLogo.svg'
import receipt from '../images/receiptcard.svg'
import taxw2 from '../images/taxw2.svg'
import businesscard from '../images/businesscard.svg'
import storage from '../images/storage.svg'
import wav from '../images/wav.svg'
import openai from '../images/openai.svg'

import { getContentModeratorPricing, getCustomLanguagePricing, getDocumentTranslatorPricing, getFormRecCustomPricing, getFormRecPrebuiltPricing, getFormRecReadPricing, getHealthLanguagePricing, getLanguagePricing, getOcrPricing, getSpeechPricing, getTranslationPricing, noCharge } from './Prices/price'

export const sc = {
    "spliceDocument": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf"
        ],
        "outputTypes": [
            "pdf"
        ],
        "image": pdf,
        "label": "Splice Document",
        "name": "spliceDocument",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "openaiEmbeddings": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "openaiEmbeddings"
        ],
        "image": openai,
        "label": "OpenAI (Embeddings)",
        "name": "openaiEmbeddings",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "openaiGeneric": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "openaiGeneric"
        ],
        "image": openai,
        "label": "OpenAI (Generic)",
        "name": "openaiGeneric",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "openai": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "openaiSummarize"
        ],
        "image": openai,
        "label": "OpenAI (Summarize Text)",
        "name": "openaiSummarize",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "simplifyInvoice": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "prebuiltInvoice"
        ],
        "outputTypes": [
            "simpleInvoice"
        ],
        "image": invoice,
        "label": "Convert the Invoice Output to a Simpler Format",
        "name": "simplifyInvoice",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "ocrToText": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "ocr"
        ],
        "outputTypes": [
            "text"
        ],
        "image": ocr,
        "label": "Convert OCR to Text",
        "name": "ocrToText",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "ocrContainerToText": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "ocrContainer"
        ],
        "outputTypes": [
            "text"
        ],
        "image": ocr,
        "label": "Convert OCR to Text (Container Version)",
        "name": "ocrContainerToText",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "tableParser": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "customFormRec",
            "layout",
            "generalDocument"
        ],
        "outputTypes": [
            "tableParser"
        ],
        "image": idcard,
        "label": "Extract Table Information for Search",
        "name": "tableParser",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "xmlToJson": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "xml"
        ],
        "outputTypes": [
            "xmlToJson"
        ],
        "image": invoice,
        "label": "Convert XML To JSON",
        "name": "xmlToJson",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "videoIndexer": {
        "defaultTier" : "Standard Transactions",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Video Indexer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "flv",
            "mxf",
            "gxf",
            "mpg",
            "wmv",
            "asf",
            "avi",
            "mp4",
            "wav",
            "mov",
            "isma",
            "ismv",
            "mkv"
        ],
        "outputTypes": [
            "videoIndexer"
        ],
        "image": storage,
        "label": "Video Indexer",
        "name": "videoIndexer",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "contentModeratorImage": {
        "defaultTier" : "Standard Transactions",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Content Moderator' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "bmp","jpg","tiff","tif","gif"
        ],
        "outputTypes": [
            "contentModeratorImage"
        ],
        "image": storage,
        "label": "Content Moderator (Image)",
        "name": "contentModeratorImage",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getContentModeratorPricing
    },
    "contentModeratorText": {
        "defaultTier" : "Standard Tansactions",
        "filters":[{ key: 'serviceName', value: 'Cognitive Services' },{ key: 'productName', value: 'Content Moderator' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "contentModeratorText"
        ],
        "image": storage,
        "label": "Content Moderator (Text)",
        "name": "contentModeratorText",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getContentModeratorPricing
    },
    "totxt": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "text"
        ],
        "image": summarize,
        "label": "Convert To TXT File",
        "name": "totxt",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    // "copy": {
    //     "bpaServiceId": "abc123",
    //     "inputTypes": [
    //         "pdf"
    //     ],
    //     "outputTypes": [
    //         "pdf"
    //     ],
    //     "image": summarize,
    //     "label": "Copy Document",
    //     "name": "copy",
    //     "serviceSpecificConfig": {},
    //     "serviceSpecificConfigDefaults": {}
    // },
   
    "automlNer": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "automlNer"
        ],
        "image": summarize,
        "label": "Auto-ML NER Custom Model",
        "name": "automlNer",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    // "test": {
    //     "bpaServiceId": "abc123",
    //     "inputTypes": [
    //         "pdf"
    //     ],
    //     "outputTypes": [
    //         "test"
    //     ],
    //     "image": pdf,
    //     "label": "Test Prebuilt Models",
    //     "name": "test",
    //     "serviceSpecificConfig": { "to":"es"},
    //     "serviceSpecificConfigDefaults": {}
    // },
    "video": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "start"
        ],
        "outputTypes": [
            "flv",
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
            "mkv"
        ],
        "image": layoutLogo,
        "label": "Video",
        "name": "video",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "images": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "start"
        ],
        "outputTypes": [
            "tiff","gif","jpg","jpeg"
        ],
        "image": layoutLogo,
        "label": "Image Document",
        "name": "image",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "xml": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "start"
        ],
        "outputTypes": [
            "xml"
        ],
        "image": generaldoc,
        "label": "XML Document",
        "name": "xml",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "pdf": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "start"
        ],
        "outputTypes": [
            "pdf"
        ],
        "image": pdf,
        "label": "PDF Document",
        "name": "pdf",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "wav": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "start"
        ],
        "outputTypes": [
            "wav"
        ],
        "image": wav,
        "label": "WAV Document",
        "name": "wav",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "ocrService": {
        "filters":[{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Computer Vision' }],
        "defaultTier" : "S1 Transactions",
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf",
            "tiff","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "ocr"
        ],
        "image": ocr,
        "label": "Optical Character Recognition (OCR) Service",
        "name": "ocr",
        "category": "OCR",
        "container" : false,
        "batchMode" : false,
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getOcrPricing
    },
    "ocrContainerService": {
        "filters":[{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Computer Vision' }],
        "defaultTier" : "S1 Transactions",
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf",
            "tiff","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "ocrContainer"
        ],
        "image": ocr,
        "label": "Optical Character Recognition (OCR) Service (Container Version)",
        "name": "ocrContainer",
        "category": "OCR",
        "container" : true,
        "batchMode" : false,
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getOcrPricing
    },
    "ocrContainerBatchService": {
        "filters":[{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Computer Vision' }],
        "defaultTier" : "S1 Transactions",
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf",
            "tiff","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "ocrContainer"
        ],
        "image": ocr,
        "label": "Optical Character Recognition (OCR) Service (Container Version) (Batch Mode)",
        "name": "ocrContainerBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getOcrPricing
    },
    "ocrBatchService": {
        "filters":[{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Computer Vision' }],
        "defaultTier" : "S1 Transactions",
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf",
            "tiff","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "ocr"
        ],
        "image": ocr,
        "label": "Optical Character Recognition (OCR) Service (Batch Mode)",
        "name": "ocrBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getOcrPricing
    },
    "translateService": {
        "defaultTier" : "S1 Characters",
        "filters":[{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Translator Text' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "text"
        ],
        "image": detectLanguage,
        "label": "Language Translation Service",
        "name": "translate",
        "serviceSpecificConfig": {
            to : "string"
        },
        "serviceSpecificConfigDefaults": {},
        getPrice : getTranslationPricing
    },
    "layout": {
        "defaultTier" : "S0 Read Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "layout"
        ],
        "image": layoutLogo,
        "label": "Form Recognizer Layout Service",
        "name": "layout",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecReadPricing
    },
    "layoutBatch": {
        "defaultTier" : "S0 Read Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "layout"
        ],
        "image": layoutLogo,
        "label": "Form Recognizer Layout Service (Batch Mode)",
        "name": "layoutBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecReadPricing
    },
    "summaryToText": {
        "defaultTier" : "Standard Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "inputTypes": [
            "extractSummary"
        ],
        "outputTypes": [
            "text"
        ],
        "image": summarize,
        "label": "Convert Summary To Plain Text",
        "name": "summaryToText",
        "bpaServiceId": "abc123",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getLanguagePricing
    },
    "extractSummary": {
        "defaultTier" : "Standard Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "extractSummary"
        ],
        "image": summarize,
        "label": "Language Studio Text Summarization",
        "name": "extractSummary",
        "bpaServiceId": "abc123",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getLanguagePricing
    },
    "extractSummaryBatch": {
        "defaultTier" : "Standard Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "extractSummary"
        ],
        "image": summarize,
        "label": "Language Studio Text Summarization (Batch Mode)",
        "name": "extractSummaryBatch",
        "bpaServiceId": "abc123",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getLanguagePricing
    },
    "recognizeEntitiesBatch": {
        "defaultTier" : "Standard Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "recognizeEntities"
        ],
        "image": ner,
        "label": "Language Studio Named Entity Recognition (Batch Mode)",
        "name": "recognizeEntitiesBatch",
        "bpaServiceId": "abc123",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getLanguagePricing
    },
    "recognizeEntities": {
        "defaultTier" : "Standard Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "recognizeEntities"
        ],
        "image": ner,
        "label": "Language Studio Named Entity Recognition",
        "name": "recognizeEntities",
        "bpaServiceId": "abc123",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getLanguagePricing
    },
    "sttService": {
        "defaultTier" : "Speech To Text",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Speech' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "wav",
            "mp3"
        ],
        "outputTypes": [
            "text"
        ],
        "image": tts,
        "label": "Speech To Text Service",
        "name": "stt",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getSpeechPricing
    },
    "sttBatchService": {
        "defaultTier" : "Speech To Text",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Speech' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "wav",
            "mp3"
        ],
        "outputTypes": [
            "text"
        ],
        "image": tts,
        "label": "Speech To Text Service (Batch)",
        "name": "sttBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getSpeechPricing
    },
    "generalDocument": {
        "defaultTier" : "S0 Pre-built Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "generalDocument"
        ],
        "image": generaldoc,
        "label": "Form Recognizer General Document Model",
        "name": "generalDocument",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecPrebuiltPricing
    },
    "prebuiltInvoice": {
        "defaultTier" : "S0 Pre-built Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "prebuiltInvoice"
        ],
        "image": invoice,
        "label": "Form Recognizer Prebuilt Invoice Model",
        "name": "prebuiltInvoice",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecPrebuiltPricing
    },
    "prebuiltBusinessCard": {
        "defaultTier" : "S0 Pre-built Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "prebuiltBusinessCard"
        ],
        "image": businesscard,
        "label": "Form Recognizer Prebuilt Business Card Model",
        "name": "prebuiltBusinessCard",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecPrebuiltPricing
    },
    "prebuiltIdentity": {
        "defaultTier" : "S0 Pre-built Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "prebuiltIdentity"
        ],
        "image": idcard,
        "label": "Form Recognizer Prebuilt ID Model",
        "name": "prebuiltIdentity",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecPrebuiltPricing
    },
    "prebuiltReceipt": {
        "defaultTier" : "S0 Pre-built Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "prebuiltReceipt"
        ],
        "image": receipt,
        "label": "Form Recognizer Receipt ID Model",
        "name": "prebuiltReceipt",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecPrebuiltPricing
    },
    "prebuiltTaxW2": {
        "defaultTier" : "S0 Pre-built Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "prebuiltTaxW2"
        ],
        "image": taxw2,
        "label": "Form Recognizer Tax-W2 ID Model",
        "name": "prebuiltTaxW2",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecPrebuiltPricing
    },
    "customFormRec": {
        "defaultTier" : "S0 Custom Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "customFormRec"
        ],
        "image": customform,
        "label": "Form Recognizer Custom Model",
        "name": "customFormRec",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecCustomPricing
    },
    "generalDocumentBatch": {
        "defaultTier" : "S0 Pre-built Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "generalDocument"
        ],
        "image": generaldoc,
        "label": "Form Recognizer General Document Model (Batch)",
        "name": "generalDocumentBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecPrebuiltPricing
    },
    "prebuiltInvoiceBatch": {
        "defaultTier" : "S0 Pre-built Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "prebuiltInvoice"
        ],
        "image": invoice,
        "label": "Form Recognizer Prebuilt Invoice Model (Batch)",
        "name": "prebuiltInvoiceBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecPrebuiltPricing
    },
    "prebuiltBusinessCardBatch": {
        "defaultTier" : "S0 Pre-built Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "prebuiltBusinessCard"
        ],
        "image": businesscard,
        "label": "Form Recognizer Prebuilt Business Card Model (Batch)",
        "name": "prebuiltBusinessCardBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecPrebuiltPricing
    },
    "prebuiltIdentityBatch": {
        "defaultTier" : "S0 Pre-built Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "prebuiltIdentity"
        ],
        "image": idcard,
        "label": "Form Recognizer Prebuilt ID Model (Batch)",
        "name": "prebuiltIdentityBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecPrebuiltPricing
    },
    "prebuiltReceiptBatch": {
        "defaultTier" : "S0 Pre-built Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "prebuiltReceipt"
        ],
        "image": receipt,
        "label": "Form Recognizer Receipt ID Model (Batch)",
        "name": "prebuiltReceiptBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecPrebuiltPricing
    },
    "prebuiltTaxW2Batch": {
        "defaultTier" : "S0 Pre-built Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "prebuiltTaxW2"
        ],
        "image": taxw2,
        "label": "Form Recognizer Tax-W2 ID Model (Batch)",
        "name": "prebuiltTaxW2Batch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecPrebuiltPricing
    },
    "customFormRecBatch": {
        "defaultTier" : "S0 Custom Pages",
        "filters":[{ key: 'serviceName', value: 'Azure Applied AI Services' },{ key: 'productName', value: 'Azure Form Recognizer' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","tif","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "customFormRec"
        ],
        "image": customform,
        "label": "Form Recognizer Custom Model (Batch)",
        "name": "customFormRecBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getFormRecCustomPricing
    },
    "recognizePiiEntities": {
        "defaultTier" : "Standard Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "recognizePiiEntities"
        ],
        "image": pii,
        "label": "Language Studio PII Model",
        "name": "recognizePiiEntities",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getLanguagePricing
    },
    "extractKeyPhrases": {
        "defaultTier" : "Standard Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "extractKeyPhrases"
        ],
        "image": keyphrase,
        "label": "Language Studio Key Phrases Model",
        "name": "extractKeyPhrases",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getLanguagePricing
    },
    "recognizeLinkedEntities": {
        "defaultTier" : "Standard Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "recognizeLinkedEntities"
        ],
        "image": linkedEntities,
        "label": "Language Studio Linked Entities Model",
        "name": "recognizeLinkedEntities",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getLanguagePricing
    },
    "analyzeSentiment": {
        "defaultTier" : "Standard Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "analyzeSentiment"
        ],
        "image": sentiment,
        "label": "Language Studio Sentiment Model",
        "name": "analyzeSentiment",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getLanguagePricing
    },
    "recognizeCustomEntities": {
        "defaultTier" : "Standard Custom Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "recognizeCustomEntities"
        ],
        "image": customNER,
        "label": "Language Studio Custom NER Model",
        "name": "recognizeCustomEntities",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getCustomLanguagePricing
    },
    "singleCategoryClassify": {
        "defaultTier" : "Standard Custom Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "singleCategoryClassify"
        ],
        "image": customNER,
        "label": "Language Studio Classify Single Class Model",
        "name": "singleCategoryClassify",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getCustomLanguagePricing
    },
    "multiCategoryClassify": {
        "defaultTier" : "Standard Custom Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "multiCategoryClassify"
        ],
        "image": customClassification,
        "label": "Language Studio Classify Mulitiple Classes Model",
        "name": "multiCategoryClassify",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getCustomLanguagePricing
    },
    "recognizePiiEntitiesBatch": {
        "defaultTier" : "Standard Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "recognizePiiEntities"
        ],
        "image": pii,
        "label": "Language Studio PII Model (Batch Mode)",
        "name": "recognizePiiEntitiesBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getLanguagePricing
    },
    "extractKeyPhrasesBatch": {
        "defaultTier" : "Standard Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "extractKeyPhrases"
        ],
        "image": keyphrase,
        "label": "Language Studio Key Phrases Model (Batch Mode)",
        "name": "extractKeyPhrasesBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getLanguagePricing
    },
    "recognizeLinkedEntitiesBatch": {
        "defaultTier" : "Standard Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "recognizeLinkedEntities"
        ],
        "image": linkedEntities,
        "label": "Language Studio Linked Entities Model (Batch Mode)",
        "name": "recognizeLinkedEntitiesBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getLanguagePricing
    },
    "analyzeSentimentBatch": {
        "defaultTier" : "Standard Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "analyzeSentiment"
        ],
        "image": sentiment,
        "label": "Language Studio Sentiment Model (Batch Mode)",
        "name": "analyzeSentimentBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getLanguagePricing
    },
    "recognizeCustomEntitiesBatch": {
        "defaultTier" : "Standard Custom Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "recognizeCustomEntities"
        ],
        "image": customNER,
        "label": "Language Studio Custom NER Model (Batch Mode)",
        "name": "recognizeCustomEntitiesBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getCustomLanguagePricing
    },
    "singleCategoryClassifyBatch": {
        "defaultTier" : "Standard Custom Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "singleCategoryClassify"
        ],
        "image": customNER,
        "label": "Language Studio Classify Single Class Model (Batch Mode)",
        "name": "singleCategoryClassifyBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getCustomLanguagePricing
    },
    "multiCategoryClassifyBatch": {
        "defaultTier" : "Standard Custom Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "multiCategoryClassify"
        ],
        "image": customClassification,
        "label": "Language Studio Classify Mulitiple Classes Model (Batch Mode)",
        "name": "multiCategoryClassifyBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getCustomLanguagePricing
    },
    "huggingFaceNER": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "huggingFaceNER"
        ],
        "image": customNER,
        "label": "HuggingFace Pretrained NER Model",
        "name": "huggingFaceNER",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "preprocess": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "preprocess"
        ],
        "image": customNER,
        "label": "Preprocess Text",
        "name": "preprocess",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
    "healthCare": {
        "defaultTier" : "Standard Health Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "healthCareResults"
        ],
        "image": customClassification,
        "label": "Health Care API",
        "name": "healthCare",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getHealthLanguagePricing
    },
    "healthCareBatch": {
        "defaultTier" : "Standard Health Text Records",
        "filters" : [{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Language' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "healthCareResults"
        ],
        "image": customClassification,
        "label": "Health Care API (Batch Mode)",
        "name": "healthCareBatch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getHealthLanguagePricing
    },
    "documentTranslation": {
        "defaultTier" : "S1 Document Characters",
        "filters":[{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Translator Text' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf"
        ],
        "outputTypes": [
            "pdf"
        ],
        "image": customClassification,
        "label": "Document Translation",
        "name": "documentTranslation",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getDocumentTranslatorPricing
    },
    "blobStorage": {
        "filters":[{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Translator Text' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
            
        ],
        "outputTypes": [
           
        ],
        "image": customClassification,
        "label": "Blob Storage",
        "name": "blobStorage",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getDocumentTranslatorPricing
    },
    "cogSearch": {
        "filters":[{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Translator Text' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
           
        ],
        "outputTypes": [
           
        ],
        "image": customClassification,
        "label": "Cognitive Search",
        "name": "cogSearch",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getDocumentTranslatorPricing
    },
    "staticWebApp": {
        "filters":[{ key: 'serviceName', value: 'Cognitive Services' }, { key: 'productName', value: 'Translator Text' }],
        "bpaServiceId": "abc123",
        "inputTypes": [
           
        ],
        "outputTypes": [
           
        ],
        "image": customClassification,
        "label": "Static Web App",
        "name": "staticWebApp",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : getDocumentTranslatorPricing
    },
    "changeOutput": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "any"
        ],
        "outputTypes": [
            "any"
        ],
        "image": summarize,
        "label": "Change Output",
        "name": "changeOutput",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {},
        getPrice : noCharge
    },
}