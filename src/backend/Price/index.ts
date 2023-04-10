import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { serviceCatalog } from "../engine/serviceCatalog"
import { BpaConfiguration, BpaPipelines, BpaService } from "../engine/types"
import { BlobDB } from "../services/db"
const _ = require('lodash')

const priceTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    //const db = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING, process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
    const db = new BlobDB(process.env.AzureWebJobsStorage,"db", process.env.BLOB_STORAGE_CONTAINER)
    try {
        const documents = Number(req.query["documents"])
        const pagesPerDocument = Number(req.query["pagesPerDocument"])
        const hoursOfAudioPerDocument = Number(req.query["hoursOfAudioPerDocument"])
        let pages = 0

        if(pagesPerDocument){
            pages = documents * pagesPerDocument
        }
        if(hoursOfAudioPerDocument){
            pages = documents * hoursOfAudioPerDocument * 2
        }

        const pipelineName = req.query["pipeline"]
        
        context.log(`Name of source doc : ${context.bindingData.priceTrigger}`)
        
        const config : BpaPipelines = await db.getConfig()
        const bpaConfig: BpaConfiguration = {
            stages: [],
            name : ""
        }

        for(const pipeline of config.pipelines){
            if(pipeline.name === pipelineName){
                for (const stage of pipeline.stages) {
                    for(const sc of Object.keys(serviceCatalog)){
                        if(stage.name === serviceCatalog[sc].name){
                            context.log(`found ${stage.name}`)
                            const newStage : BpaService = _.cloneDeep(serviceCatalog[sc])
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

        let price = 0.0
        const invoice = []
        for(const stage of bpaConfig.stages){
            if(stage.service.name === "documentTranslation"){
                const tempPrice = stage.service.getPrice(documents)  
                price += tempPrice
                invoice.push({name : stage.service.name, price : tempPrice})
            } else{
                const tempPrice = stage.service.getPrice(pages)  
                price += tempPrice
                invoice.push({name : stage.service.name, price : tempPrice})
            }
            
        }

        context.res = {
            status : 200,
            body : {price : price, invoice : invoice}
        }

    }
    catch (err) {
        context.log(err)
        context.res = {
            status : 500,
            body : err.message
        }
    }
};

export default priceTrigger;