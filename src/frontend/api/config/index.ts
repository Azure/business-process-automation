import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient, ItemDefinition } from "@azure/cosmos";
import { QueryCollectionFormat } from "@azure/core-http";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if (req.method === "POST") {
        try {
            context.log('HTTP trigger function processed a request.');
            const out = await create(context, req)
            context.res = {
                body: out
            }
        } catch (err) {
            context.log(err)
            context.res = {
                body: err
            }
            return
        } 
    } else if(req.method === "DELETE"){
        try{
            const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
            const database = client.database(process.env.COSMOS_DB_DB);
            const container = database.container(process.env.COSMOS_DB_CONTAINER);
            const result = await deleteConfig(container, req.query.id, req.query.name);
            context.res = {
                body : result
            }
        } catch(err){
            context.log(err)
            context.res = {
                body: err
            }
        }

    }else {
        try{
            const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
            const database = client.database(process.env.COSMOS_DB_DB);
            const container = database.container(process.env.COSMOS_DB_CONTAINER);
            const result = await getConfig(container, req.query.id)
            context.res = {
                body : result
            }
        } catch(err){
            context.log(err)
            context.res = {
                body: err
            }
        }
        
    }
};

const getConfig = async (container, id) : Promise<any> => {
    try{
        const item = await container.item(id).read()
        return item.resource
    } catch(err){
        console.log(err)
    }
    return null
}

const deleteConfig = async (container, id, name) : Promise<any> => {
    try{
        const item = await container.item(id).read()
        const newPipelines = [];
        if(item?.resource?.pipelines){
            for(const pipeline of item.pipelines){
                if(pipeline.name !== name){
                    newPipelines.push(pipeline)
                }
            }
            const { resource: createdItem } = await container.items.upsert(newPipelines);
            return createdItem
        }
    } catch(err){
        console.log(err)
    }
    return null
}

const create = async function (context: Context, req: HttpRequest): Promise<ItemDefinition> {

    context.log('HTTP trigger function processed a request.');
    const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);

    const database = client.database(process.env.COSMOS_DB_DB);
    const container = database.container(process.env.COSMOS_DB_CONTAINER);
    const { resource: createdItem } = await container.items.upsert(req.body);
    return createdItem
};

export default httpTrigger;
