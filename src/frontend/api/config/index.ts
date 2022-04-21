import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient, ItemDefinition } from "@azure/cosmos";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if (req.method === "POST") {
        try {
            context.log('HTTP trigger function processed a request.');
            //const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
            //context.log(`body : ${JSON.stringify(req.body)}`)
            //const database = client.database(process.env.COSMOS_DB_DB);
            //const container = database.container(process.env.COSMOS_DB_CONTAINER);
            //const item = await container.item("1")
            //await item.delete()
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
        } finally {
            const out = await create(context, req)
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: out
            };
        }
    } else {
        try{
            const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
            const database = client.database(process.env.COSMOS_DB_DB);
            const container = database.container(process.env.COSMOS_DB_CONTAINER);
            const result = await getConfig(container)
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

const getConfig = async (container) : Promise<any> => {
    try{
        const item = await container.item("1").read()
        return item.resource
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
