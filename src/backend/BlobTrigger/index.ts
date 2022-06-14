import { AzureFunction, Context } from "@azure/functions"
import { BpaEngine } from "../engine"
import { serviceCatalog } from "../engine/serviceCatalog"
import { BpaConfiguration } from "../engine/types"
import { CogSearch } from "../services/cogsearch"
import { CosmosDB } from "../services/cosmosdb"
const _ = require('lodash')

const blobTrigger: AzureFunction = async function (context: Context, myBlob: Buffer): Promise<void> {

    const db = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING, process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
    const cogSearch = new CogSearch(process.env.COGSEARCH_URL, process.env.COGSEARCH_APIKEY, `${process.env.BLOB_STORAGE_ACCOUNT_NAME}`)
    try {
        context.log(`Name of source doc : ${context.bindingData.blobTrigger}`)
        
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
        const out = await engine.processFile(myBlob, context.bindingData.blobTrigger, bpaConfig)
        await db.view(out) 
        context.res = {
            status : 200,
            body : out.aggregatedResults
        }

     
        const isCreateSkill = await db.getDocSearchCustomSkillConfig()
        if(isCreateSkill?.createSkill){
            const customSkillUrl = `https://${process.env.BLOB_STORAGE_ACCOUNT_NAME}.azurewebsites.net/api/CustomSkill`
            await cogSearch.generateCustomSearchSkill(out)
        }

    }
    catch (err) {
        context.log(err)
        await db.view({
            data : err.message,
            type : "error",
            label : "error",
            projectName : "error",
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

export default blobTrigger;