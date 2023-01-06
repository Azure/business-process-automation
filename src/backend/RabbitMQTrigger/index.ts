import { AzureFunction, Context } from "@azure/functions"
import { RabbitMQ } from "../services/messageQueue";
import { MongoDB } from "../services/db"
import { mqTrigger } from "../services/commonTrigger";
const _ = require('lodash')

const rabbitMQTrigger: AzureFunction = async function (context: Context, mySbMsg: any): Promise<void> {

    const mq = new RabbitMQ()
    const db = new MongoDB(process.env.MONGODB_CONNECTION_STRING,process.env.MONGODB_DB_NAME, process.env.MONGODB_CONTAINER_NAME)
    await mqTrigger(context, mySbMsg, mq, db)
    return
};

export default rabbitMQTrigger;
