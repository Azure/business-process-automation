import { AzureFunction, Context } from "@azure/functions"
import { RabbitMQ } from "../services/messageQueue";
import { mqTrigger } from "../services/commonTrigger";
const _ = require('lodash')

const rabbitMQTrigger: AzureFunction = async function (context: Context, mySbMsg: any): Promise<void> {

    const mq = new RabbitMQ()
    await mqTrigger(context, mySbMsg, mq)
    return
};

export default rabbitMQTrigger;
