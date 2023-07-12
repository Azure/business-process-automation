import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios"
 
const convertToMessage = (history) => {
    const messages = []
    for(const h of history){
        if(h?.user){
            messages.push({role:"user",content:h.user})
        } if(h?.assistant){
            messages.push({role:"assistant",content:h.assistant})
        } if(h?.tool){
            messages.push({role:"tool",content:h.tool})
        }
    }

    return messages
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const url = `${process.env.OPENAI_ENDPOINT}openai/deployments/${process.env.OPENAI_DEPLOYMENT_TEXT}/extensions/chat/completions?api-version=2023-06-01-preview`
    const headers = {
        "Content-Type": "application/json",
        "api-key": process.env.OPENAI_KEY,
        "chatgpt_url": `${process.env.OPENAI_ENDPOINT}openai/deployments/${process.env.OPENAI_DEPLOYMENT_TEXT}/chat/completions?api-version=2023-03-15-preview`,
        "chatgpt_key": process.env.OPENAI_KEY,
        "accept":"*/*"
        
    }
    const body = {
        "dataSources": [
            {
                "type": "AzureCognitiveSearch",
                "parameters": {
                    "endpoint": process.env.COGSEARCH_URL,
                    "key": process.env.COGSEARCH_APIKEY,
                    "indexName": req.body.index.name,
                    "semanticConfiguration": "default",
                    "queryType": "simple",
                    "fieldsMapping": {
                        "contentFieldsSeparator": "\n",
                        "contentFields": [
                            "text"
                        ],
                        "filepathField": "filename",
                        "titleField": "filename",
                        "urlField": "filename"
                    },
                    "inScope": true,
                    "roleInformation": "You are an AI assistant that helps people find information."
                }
            }
        ],
        "messages": convertToMessage(req.body.history),
        "deployment": process.env.OPENAI_DEPLOYMENT_TEXT,
        "temperature": 0,
        "top_p": 1,
        "max_tokens": 800,
        "stop": null,
        "stream": false
    }
    try{
        const {data} = await axios.post(url, body, { headers: headers })

        let answer = ''
        let citations = []
        for(const c of data.choices){
            for(const m of c.messages){
                if(m.role === 'tool'){
                    const contentObj = JSON.parse(m.content)
                    citations = contentObj.citations
                } else if(m.role === 'assistant'){
                    answer = m.content
                }
            }
        }
       
        context.res = {
            body: {"data_points": citations, "answer":answer, "thoughts": JSON.stringify(data.choices)}
        }

    } catch(err){
        context.res = {
            body: JSON.stringify(err)
        }
    }

    // if (req.method === "POST") {
    //     try{
    //         const response = await axios.post(`${process.env.HUGGINGFACE_ENDPOINT}/api/chat`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: req.body
    //         });

    //         const parsedResponse = await response.data
    //         if (response.status > 299 ) {
    //             throw Error(parsedResponse.error || "Unknown error");
    //         }

    //         context.res = {
    //             body: parsedResponse
    //         }
    //     } catch(e){
    //         context.res = {
    //             body: {error : e}
    //         }
    //         console.log(e)
    //     }

    // } 
};


export default httpTrigger;
