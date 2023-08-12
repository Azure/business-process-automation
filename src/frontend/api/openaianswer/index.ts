//import { SearchIndexClient, AzureKeyCredential } from "@azure/search-documents";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios, { AxiosRequestConfig } from "axios";


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    try {
        context.log('HTTP trigger function processed a request. (Get Index)');

        const headers = {
            'api-key': process.env.OPENAI_KEY,
            'Content-Type': 'application/json'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        let url = `${process.env.OPENAI_ENDPOINT}openai/deployments/${process.env.OPENAI_DEPLOYMENT_TEXT}/chat/completions?api-version=2023-03-15-preview`

        let truncatedString = ""
        if(req?.body?.text){
            truncatedString = req.body.text.slice(0, 3500)
        }

        const messages = [
            {role : "system", content : "I'm a friendly assistant that answers questions based on the context.  I do not make up answer, I only use the information in the context."},
            {role : "user", content : `Question : ${req.body.q}  Context: ${truncatedString}`}
        ]
        
        let body = {
            "messages": messages,
            "temperature": 0,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0,
            "max_tokens": 800,
            "stop": null
          }

        const out = await axios.post(url, body, config)

        context.res = {
            body: {out: out.data.choices[0].message.content}
        }
    } catch (err) {
        context.log(err)
        context.res = {
            body: err
        }
        return
    }
}


export default httpTrigger;
