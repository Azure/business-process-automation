const { ServiceBusClient } = require("@azure/service-bus");

export class AzureServiceBus {
    constructor() {

    }

    public status = async () => {
        const serviceBusClient = new ServiceBusClient(process.env.SERVICE_BUS_CONNECTION_STRING);
        // If receiving from a subscription you can use the createReceiver(topicName, subscriptionName) overload
        const queueReceiver = serviceBusClient.createReceiver("upload");

        let queuedFiles = []
        try {
            // peeking messages does not lock or remove messages from a queue or subscription.
            // For locking and/or removal, look at the `receiveMessagesLoop` or `receiveMessagesStreaming` samples,
            // which cover using a receiver with a `receiveMode`.
            console.log(`Attempting to peek 10 messages at a time`);
            const peekedMessages = await queueReceiver.peekMessages(100000);
            
            queuedFiles = peekedMessages.map((qf)=>{
                if(qf?.body?.subject){
                    return `${qf.body.subject}  STATE: ${qf.state}`  
                } else if(qf?.body?.filename){
                    return `${qf.body.filename} ASYNC_TRANSACTION  STATE: ${qf.state}`
                } 
                return "unknown message format"
                
            })

            await queueReceiver.close();
        } finally {
            await serviceBusClient.close();
        }

        return queuedFiles
    }
}