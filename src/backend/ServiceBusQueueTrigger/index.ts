import { AzureFunction, Context } from "@azure/functions"
import { ServiceBusMQ } from "../services/messageQueue";
import { CosmosDB } from "../services/db"
import { mqTrigger } from "../services/commonTrigger";

const serviceBusQueue: AzureFunction = async function (context: Context, mySbMsg: any): Promise<void> {
    const mq = new ServiceBusMQ()
    const db = new CosmosDB(process.env.COSMOSDB_CONNECTION_STRING,process.env.COSMOSDB_DB_NAME, process.env.COSMOSDB_CONTAINER_NAME)
    await mqTrigger(context, mySbMsg, mq, db)
};

export default serviceBusQueue;
