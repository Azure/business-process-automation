import { CosmosDB } from "../services/cosmosdb"
import { LanguageStudio } from "../services/language"
import { Speech } from '../services/speech'
import { Ocr } from "../services/ocr"
import { BpaService } from "./types"
import { FormRec } from "../services/formrec"
import { Translate } from "../services/translate"
import { HuggingFace } from "../services/huggingface"
import { Test } from "../services/test"
import { Preprocess } from "../services/preprocess"
import { DocumentTranslation } from "../services/documentTranslation"
import { AutoMlNer } from "../services/automlner"
import { ChangeOutput } from "../services/changeOutput"
import { Blob } from "../services/blob"
import { ContentModerator } from "../services/contentModerator"
import { Xml } from "../services/xml"

const changeOutput = new ChangeOutput()
const blob = new Blob(process.env.AzureWebJobsStorage, process.env.BLOB_STORAGE_CONTAINER)
const ocr = new Ocr(process.env.OCR_ENDPOINT,process.env.OCR_APIKEY)
const cosmosDb = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING,process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
const language = new LanguageStudio(process.env.LANGUAGE_STUDIO_PREBUILT_ENDPOINT, process.env.LANGUAGE_STUDIO_PREBUILT_APIKEY)
const speech = new Speech(process.env.SPEECH_SUB_KEY,process.env.SPEECH_SUB_REGION)
const formrec = new FormRec(process.env.FORMREC_ENDPOINT, process.env.FORMREC_APIKEY)
const translate = new Translate(process.env.TRANSLATE_ENDPOINT, process.env.TRANSLATE_APIKEY, process.env.TRANSLATE_REGION)
const huggingface = new HuggingFace(process.env.HUGGINGFACE_ENDPOINT)
const preprocess = new Preprocess(process.env.HUGGINGFACE_ENDPOINT)
const documentTranslation = new DocumentTranslation(process.env.BLOB_STORAGE_ACCOUNT_NAME, process.env.BLOB_STORAGE_ACCOUNT_KEY, process.env.DOCUMENT_TRANSLATION_ENDPOINT, process.env.DOCUMENT_TRANSLATION_KEY)
const automlNer = new AutoMlNer(process.env.AUTOML_NER_ENDPOINT, process.env.AUTOML_NER_APIKEY)
const test = new Test()
const contentModerator = new ContentModerator(process.env.CONTENT_MODERATOR_ENDPOINT,process.env.CONTENT_MODERATOR_KEY)
const xml = new Xml()

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
    inputTypes: ["pdf","jpg","png","jpeg"],
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
    inputTypes: ["pdf","jpg","png","jpeg"],
    outputTypes: ["layout"],
    name: "layout",
    process: formrec.layout,
    serviceSpecificConfig: {
        
    },
    serviceSpecificConfigDefaults: {

    }
}

const generalDocument : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg","png","jpeg"],
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
    inputTypes: ["pdf","jpg","png","jpeg"],
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
    inputTypes: ["pdf","jpg","png","jpeg"],
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
    inputTypes: ["pdf","jpg","png","jpeg"],
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
    inputTypes: ["pdf","jpg","png","jpeg"],
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
    inputTypes: ["pdf","jpg","png","jpeg"],
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
    inputTypes: ["pdf","jpg","png","jpeg"],
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

const ocrService : BpaService = {
    bpaServiceId : "abc123",
    inputTypes: ["pdf","jpg"],
    outputTypes: ["text"],
    name: "ocr",
    process: ocr.process,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const viewService : BpaService = {
    inputTypes: ["any"],
    outputTypes: ["any"],
    name: "view",
    bpaServiceId: "abc123",
    process: cosmosDb.view,
    serviceSpecificConfig: {

    },
    serviceSpecificConfigDefaults: {

    }
}

const extractSummary : BpaService = {
    inputTypes: ["text"],
    outputTypes: ["text"],
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
    "ocrService" : ocrService, 
    "viewService" : viewService,
    "extractSummary" : extractSummary,
    "sttService" : sttService,
    "layout" : layout,
    "translate" : translateService,
    "generalDocument" : generalDocument,
    "prebuiltBusinessCard" : prebuiltBusinessCard,
    "prebuiltIdentity" : prebuiltIdentity,
    "prebuiltInvoice" : prebuiltInvoice,
    "prebuiltReceipt" : prebuiltReceipt,
    "prebuiltTaxW2" : prebuiltTaxW2,
    "customFormRec" : customFormRec,
    "analyzeSentiment" : analyzeSentiment,
    "extractKeyPhrases" : extractKeyPhrases,
    "multiCategoryClassify" : multiCategoryClassify,
    "recognizeCustomEntities" : recognizeCustomEntities,
    "recognizeEntities" : recognizeEntities,
    "recognizeLinkedEntities" : recognizeLinkedEntities,
    "recognizePiiEntities" : recognizePiiEntities,
    "singleCategoryClassify" : singleCategoryClassify,
    "huggingFaceNER" : huggingFaceNER,
    "preprocess" : preprocessService,
    "testService" : testService,
    "healthCare" : healthCareService,
    "documentTranslation" : documentTranslationService,
    "automlNer" : automlNerService,
    "changeOutput" : changeOutputService,
    "totxt" : toTxtService,
    "contentModeratorText" : contentModeratorTextService,
    "contentModeratorImage" : contentModeratorImageService,
    "xmlToJson" : xmlToJsonService
}

