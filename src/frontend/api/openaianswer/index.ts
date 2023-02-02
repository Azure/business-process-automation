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

        let url = `${process.env.OPENAI_ENDPOINT}openai/deployments/${process.env.OPENAI_DEPLOYMENT_TEXT}/completions?api-version=2022-12-01`

        const truncatedString = req.body.document.aggregatedResults.ocr.content.slice(0, 3500)
        const q = req.body.q
        let body = {
            "prompt": truncatedString + "\n\n\n" + q,
            "temperature": 0.7,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0,
            "best_of": 1,
            "max_tokens": 400,
            "stop": null
          }

        const out = await axios.post(url, body, config)

        context.res = {
            body: {out: out.data.choices[0]}
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
