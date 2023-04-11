import { ServiceBusAdministrationClient, ServiceBusClient } from "@azure/service-bus"

export class AzureServiceBus {
    constructor() {

    }

    public status = async () => {
        const serviceBusClient = new ServiceBusClient(process.env.SERVICE_BUS_CONNECTION_STRING);
        const serviceBusAdminClient = new ServiceBusAdministrationClient(process.env.SERVICE_BUS_CONNECTION_STRING)
        // If receiving from a subscription you can use the createReceiver(topicName, subscriptionName) overload
        const queueReceiver = serviceBusClient.createReceiver("upload");

        let queuedFiles = []
        let queueProperties
        try {
            queueProperties = await serviceBusAdminClient.getQueueRuntimeProperties("upload")
            // peeking messages does not lock or remove messages from a queue or subscription.
            // For locking and/or removal, look at the `receiveMessagesLoop` or `receiveMessagesStreaming` samples,
            // which cover using a receiver with a `receiveMode`.
            console.log(`Attempting to peek 10 messages at a time`);
            const peekedMessages = await queueReceiver.peekMessages(100000);
            
            queuedFiles = peekedMessages.map((qf)=>{
                if(qf?.body?.subject){
                    return {filename: qf.body.subject, state : qf.state, isAsync : false}
                } else if(qf?.body?.filename){
                    return {filename: qf.body.filename, pipeline: qf.body.pipeline, label: qf.body.label, type: qf.body.type, dbId : qf.body.dbId}
                } 
                return "unknown message format"
                
            })

            await queueReceiver.close();
        } finally {
            await serviceBusClient.close();
        }

        return { queueProperties : queueProperties, queuedFiles : queuedFiles}
    }
}