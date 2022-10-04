import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosDB } from "../services/cosmosdb";
import { BpaConfiguration, BpaPipelines } from "../engine/types";
import { BpaEngine } from "../engine"
import { serviceCatalog } from "../engine/serviceCatalog"
const _ = require('lodash')

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const db = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING, process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
    try {
        const directoryName = req.body.pipeline
        const config : BpaPipelines = await db.getConfig()
        const bpaConfig: BpaConfiguration = {
            stages: [],
            name : req.body.pipeline
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
        let body = _.cloneDeep(req.body)
        const out = await engine.processAsync(body, body.index, bpaConfig)
        body.aggregatedResults = out.aggregatedResults
        body.type = out.type
        body.resultsIndexes = out.resultsIndexes
        delete body.stages
        delete body.data
        await db.create(body)
        context.res = {
            status : 200,
            body : out
        }

    }
    catch (err) {
        context.log(err)
        await db.view({
            data : err.message,
            type : "error",
            label : "Async Completion Trigger",
            filename : req.body.filename,
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

export default httpTrigger;
