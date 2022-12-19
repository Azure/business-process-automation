import { AzureFunction, Context } from "@azure/functions"
import { Blob } from "../services/blob"
import { BpaEngine } from "../engine"
import { CosmosDB } from "../services/cosmosdb";
import { serviceCatalog } from "../engine/serviceCatalog"
import { BpaConfiguration, BpaPipelines } from "../engine/types"
import { CogSearch } from "../services/cogsearch"
const _ = require('lodash')

const serviceBusQueueTrigger: AzureFunction = async function(context: Context, mySbMsg: any): Promise<void> {
    context.log('ServiceBus queue trigger function processed message', mySbMsg);
    const filename = mySbMsg.subject.split("/")[mySbMsg.subject.split("/").length - 1]
    const directoryName = mySbMsg.subject.split("/")[6]

    const blob = new Blob(process.env.AzureWebJobsStorage, process.env.BLOB_STORAGE_CONTAINER)
    const myBuffer = await blob.getBuffer(directoryName + "/" + filename)

    const db = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING, process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
    try {
        context.log(`Name of source doc : ${filename}`)
        //const directoryName = context.bindingData.blobTrigger.split('/')[1]
        const config : BpaPipelines = await db.getConfig()
        const bpaConfig: BpaConfiguration = {
            stages: [],
            name : ""
        }

        for(const pipeline of config.pipelines){
            if(pipeline.name === directoryName){
                for (const stage of pipeline.stages) {
                    for(const sc of Object.keys(serviceCatalog)){
                        if(stage.name === serviceCatalog[sc].name){
                            context.log(`found ${stage.name}`)
                            const newStage = _.cloneDeep(serviceCatalog[sc])
                            newStage.serviceSpecificConfig = stage.serviceSpecificConfig
                            bpaConfig.stages.push({ service : newStage })
                            bpaConfig.name = pipeline.name
                        }
                    }
                }
            }
        }

        if(bpaConfig.stages.length === 0) {
            throw new Error("No Pipeline Found")
        }
        

        const engine = new BpaEngine()
        const out = await engine.processFile(myBuffer, context.bindingData.blobTrigger, bpaConfig)

        await db.view(out) 
        context.res = {
            status : 200,
            body : out
        }

     
        const isCreateSkill = await db.getDocSearchCustomSkillConfig()
        if(isCreateSkill?.createSkill){
            const cogSearch = new CogSearch(process.env.COGSEARCH_URL, process.env.COGSEARCH_APIKEY, directoryName)
            //const customSkillUrl = `https://${process.env.BLOB_STORAGE_ACCOUNT_NAME}.azurewebsites.net/api/CustomSkill`
            await cogSearch.generateCustomSearchSkill(out)
        }

    }
    catch (err) {
        context.log(err)
        await db.view({
            data : err.message,
            type : "error",
            label : "blobTrigger",
            filename : context.bindingData.blobTrigger,
            pipeline : "error",
            bpaId : "error",
            aggregatedResults : {},
            resultsIndexes : null
        })
        context.res = {
            status : 500,
            body : err.message
        }
    }

};

export default serviceBusQueueTrigger;
