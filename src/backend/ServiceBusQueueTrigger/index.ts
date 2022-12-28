import { AzureFunction, Context } from "@azure/functions"
import { ServiceBusMQ } from "../services/messageQueue";
import { mqTrigger } from "../services/commonTrigger";

const serviceBusQueue: AzureFunction = async function (context: Context, mySbMsg: any): Promise<void> {
    const mq = new ServiceBusMQ()
    await mqTrigger(context, mySbMsg, mq)
};

export default serviceBusQueue;
