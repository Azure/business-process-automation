import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const result = await axios.get('https://bpaengine2.azurewebsites.net/api/HttpTrigger')

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: result.data
    };

};

export default httpTrigger;