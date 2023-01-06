import { ServiceBusClient } from "@azure/service-bus"
import amqplib from "amqplib"


export default abstract class MessageQueue {
    public abstract sendMessage(message : any) : Promise<void>;
    public abstract scheduleMessage(message : any, time : number) : Promise<void>;
}

export class ServiceBusMQ implements MessageQueue{

    public async sendMessage(message: any): Promise<void> {
        const serviceBusClient = new ServiceBusClient(process.env.AzureWebJobsServiceBus);
        const sender = serviceBusClient.createSender("upload")
        const messages = [
            { body: message }
        ]

        await sender.sendMessages(messages)
        await sender.close();
        await serviceBusClient.close();
    }

    public async scheduleMessage(message : any, timeInMs : number): Promise<void> {
        const serviceBusClient = new ServiceBusClient(process.env.AzureWebJobsServiceBus);
        const sender = serviceBusClient.createSender("upload")
        const messages = [
            { body: message }
        ]

        var t = new Date();
        t.setSeconds(t.getSeconds() + 10);
        await sender.scheduleMessages(messages, t)
        await sender.close();
    }

}

export class RabbitMQ implements MessageQueue{

    public async sendMessage(message: any): Promise<void> {
        const queue = 'upload';
        const conn = await amqplib.connect(process.env.AzureWebJobsRabbitMQ);
        const queueConnection = await conn.createChannel();
        await queueConnection.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
        await queueConnection.close()
        await conn.close()
    }

    public async scheduleMessage(message : any, timeInMs : number): Promise<void> {
        setTimeout(() => {
            this.sendMessage(message)
        }, timeInMs);
    }
}