import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios";
import { BlobDB } from "../db";

const db = new BlobDB(process.env.BLOB_STORAGE_CONNECTION_STRING, '', 'results')
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if (req.method === "GET") {
        try {
            context.log('HTTP trigger function processed a request.');
            const out = await axios.get(`https://${process.env.COSMOS_DB_CONTAINER}.azurewebsites.net/api/VectorSearch?query=${req.query.query}&pipeline=${req.query.pipeline}`)
            const documents = []
            for(const doc of out.data.documents){
                console.log(doc)
                const document = await db.get(`${req.query.pipeline}/${doc.id}`)
                documents.push({document: document, score : doc.value.dist})
            }
            context.res = {
                body: {
                    documents : documents,
                    oaiAnswer: out.data.oaiAnswer
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        } catch (err) {
            context.log(err)
            context.res = {
                body: err
            }
            return
        } 
    }
};

export default httpTrigger;
