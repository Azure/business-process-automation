import pdf from './images/pdf.svg'
import sentiment from './images/sentimentDemoLogo.svg'
import detectLanguage from './images/detectLanguageDemoLogo.svg'
import ner from './images/nerDemoLogo.svg'
import ocr from './images/ocrLogo.svg'
import summarize from './images/summarizationDemoLogo.svg'
import tts from './images/textToSpeech.svg'
import pii from './images/piiDemoLogo.svg'
import keyphrase from './images/keyPhrasesDemoLogo.svg'
import linkedEntities from './images/linkedEntitiesDemoLogo.svg'
import customNER from './images/customEntityExtractionLogo.svg'
import customClassification from './images/customEntityExtractionLogo.svg'
import customform from './images/customform.svg'
import generaldoc from './images/customform.svg'
import idcard from './images/idcard.svg'
import invoice from './images/invoice.svg'
import layoutLogo from './images/layoutLogo.svg'
import receipt from './images/receiptcard.svg'
import taxw2 from './images/taxw2.svg'
import businesscard from './images/businesscard.svg'
import storage from './images/storage.svg'
import wav from './images/wav.svg'

export const sc = {
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
        "serviceSpecificConfigDefaults": {}
    },
    "contentModeratorImage": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "bmp","jpg","tiff","gif"
        ],
        "outputTypes": [
            "contentModeratorImage"
        ],
        "image": storage,
        "label": "Content Moderator (Image)",
        "name": "contentModeratorImage",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {}
    },
    "contentModeratorText": {
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
        "serviceSpecificConfigDefaults": {}
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
        "serviceSpecificConfigDefaults": {}
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
        "serviceSpecificConfigDefaults": {}
    },
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
        "serviceSpecificConfigDefaults": {}
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
        "serviceSpecificConfigDefaults": {}
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
        "serviceSpecificConfigDefaults": {}
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
        "serviceSpecificConfigDefaults": {}
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
        "serviceSpecificConfigDefaults": {}
    },
    "ocrService": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf",
            "tiff","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "text"
        ],
        "image": ocr,
        "label": "Optical Character Recognition (OCR) Service",
        "name": "ocr",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {}
    },
    "translateService": {
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
        "serviceSpecificConfigDefaults": {}
    },
    "layout": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "layout"
        ],
        "image": layoutLogo,
        "label": "Form Recognizer Layout Service",
        "name": "layout",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {}
    },
    "viewService": {
        "inputTypes": [
            "any"
        ],
        "outputTypes": [
            "any"
        ],
        "image": storage,
        "label": "Export Last Stage To DB",
        "name": "view",
        "bpaServiceId": "abc123",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {}
    },
    "extractSummary": {
        "inputTypes": [
            "text"
        ],
        "outputTypes": [
            "text"
        ],
        "image": summarize,
        "label": "Language Studio Text Summarization",
        "name": "extractSummary",
        "bpaServiceId": "abc123",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {}
    },
    "recognizeEntities": {
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
        "serviceSpecificConfigDefaults": {}
    },
    "sttService": {
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
        "serviceSpecificConfigDefaults": {}
    },
    "generalDocument": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "generalDocument"
        ],
        "image": generaldoc,
        "label": "Form Recognizer General Document Model",
        "name": "generalDocument",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {}
    },
    "prebuiltInvoice": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "prebuiltInvoice"
        ],
        "image": invoice,
        "label": "Form Recognizer Prebuilt Invoice Model",
        "name": "prebuiltInvoice",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {}
    },
    "prebuiltBusinessCard": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "prebuiltBusinessCard"
        ],
        "image": businesscard,
        "label": "Form Recognizer Prebuilt Business Card Model",
        "name": "prebuiltBusinessCard",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {}
    },
    "prebuiltIdentity": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "prebuiltIdentity"
        ],
        "image": idcard,
        "label": "Form Recognizer Prebuilt ID Model",
        "name": "prebuiltIdentity",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {}
    },
    "prebuiltReceipt": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "prebuiltReceipt"
        ],
        "image": receipt,
        "label": "Form Recognizer Receipt ID Model",
        "name": "prebuiltReceipt",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {}
    },
    "prebuiltTaxW2": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "prebuiltTaxW2"
        ],
        "image": taxw2,
        "label": "Form Recognizer Tax-W2 ID Model",
        "name": "prebuiltTaxW2",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {}
    },
    "customFormRec": {
        "bpaServiceId": "abc123",
        "inputTypes": [
            "pdf","tiff","gif","jpg","jpeg"
        ],
        "outputTypes": [
            "customFormRec"
        ],
        "image": customform,
        "label": "Form Recognizer Custom Model",
        "name": "customFormRec",
        "serviceSpecificConfig": {},
        "serviceSpecificConfigDefaults": {}
    },
    "recognizePiiEntities": {
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
        "serviceSpecificConfigDefaults": {}
    },
    "extractKeyPhrases": {
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
        "serviceSpecificConfigDefaults": {}
    },
    "recognizeLinkedEntities": {
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
        "serviceSpecificConfigDefaults": {}
    },
    "analyzeSentiment": {
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
        "serviceSpecificConfigDefaults": {}
    },
    "recognizeCustomEntities": {
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
        "serviceSpecificConfigDefaults": {}
    },
    "singleCategoryClassify": {
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
        "serviceSpecificConfigDefaults": {}
    },
    "multiCategoryClassify": {
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
        "serviceSpecificConfigDefaults": {}
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
        "serviceSpecificConfigDefaults": {}
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
        "serviceSpecificConfigDefaults": {}
    },
    "healthCare": {
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
        "serviceSpecificConfigDefaults": {}
    },
    "documentTranslation": {
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
        "serviceSpecificConfigDefaults": {}
    }
}