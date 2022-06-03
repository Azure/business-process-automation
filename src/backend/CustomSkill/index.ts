import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosDB } from "../services/cosmosdb";
import { Blob } from "../services/blob"
import { BpaConfiguration } from "../engine/types";
import { BpaEngine } from "../engine"
import { serviceCatalog } from "../engine/serviceCatalog"
const _ = require('lodash')


const processSkill = async(context, value) : Promise<any> => {
    try{
        const recordId = value.recordId
        const filename = value.data.filename
        console.log(filename)
        const db = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING, process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)

        const blob = new Blob(process.env.AzureWebJobsStorage, process.env.BLOB_STORAGE_COGSEARCH_CONTAINER)
        const fileBuffer : Buffer = await blob.getBuffer(filename)
        
    
        const config = await db.getConfig()
        context.log(JSON.stringify(config.stages))
        const bpaConfig: BpaConfiguration = {
            stages: []
        }
    
        for (const stage of config.stages) {
            for(const sc of Object.keys(serviceCatalog)){
                if(stage.name === serviceCatalog[sc].name){
                    context.log(`found ${stage.name}`)
                    const newStage = _.cloneDeep(serviceCatalog[sc])
                    newStage.serviceSpecificConfig = stage.serviceSpecificConfig
                    bpaConfig.stages.push({ service : newStage })
                }
            }
        }
    
        const engine = new BpaEngine()
        const output = await engine.processFile(fileBuffer, filename, bpaConfig)
        return {"recordId" : recordId, "data" : {"aggregatedResults" : output}}
    } catch(err){
        console.log(err)
    }
   
    throw new Error("died...")
}



const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request. Skill');
   
    const results = []
    if(req.body){
        for(const value of req.body.values){
            results.push(await processSkill(context, value))
        }
    }

    context.res = {
        body: {values : results},
        headers: {
            'Content-Type': 'application/json'
        }
    };

};

export default httpTrigger;

// const db = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING, process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
//     try {
//         context.log(`Name of source doc : ${context.bindingData.blobTrigger}`)
        
//         const config = await db.getConfig()
//         context.log(JSON.stringify(config.stages))
//         const bpaConfig: BpaConfiguration = {
//             stages: []
//         }

//         for (const stage of config.stages) {
//             for(const sc of Object.keys(serviceCatalog)){
//                 if(stage.name === serviceCatalog[sc].name){
//                     context.log(`found ${stage.name}`)
//                     const newStage = _.cloneDeep(serviceCatalog[sc])
//                     newStage.serviceSpecificConfig = stage.serviceSpecificConfig
//                     bpaConfig.stages.push({ service : newStage })
//                 }
//             }
//         }

//         const engine = new BpaEngine()
//         await engine.processFile(myBlob, context.bindingData.blobTrigger, bpaConfig)
//     }
//     catch (err) {
//         context.log(err)
//         db.view({
//             data : err.message,
//             type : "error",
//             label : "error",
//             projectName : "error",
//             bpaId : "error",
//             aggregatedResults : {}
//         })
//     }