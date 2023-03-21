import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios"



const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if (req.method === "POST") {
        try{
            const response = await axios.post("http://localhost:7072/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: req.body
            });
        
            const parsedResponse = await response.data
            if (response.status > 299 ) {
                throw Error(parsedResponse.error || "Unknown error");
            }

            context.res = {
                body: parsedResponse
            }
        } catch(e){
            console.log(e)
        }
        
    } 
};


export default httpTrigger;
