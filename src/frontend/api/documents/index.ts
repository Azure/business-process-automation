import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import HTTP_CODES from "http-status-enum";
import * as multipart from "parse-multipart";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {
    context.log('upload HTTP trigger function processed a request. 3');

    // if (!req.query?.username) {
    //     context.res.body = `username is not defined`;
    //     context.res.status = HTTP_CODES.BAD_REQUEST
    // }

    //`filename` is required property to use multi-part npm package
    if (!req.query?.filename) {
        context.res.body = `filename is not defined`;
        context.res.status = HTTP_CODES.BAD_REQUEST
    }

    if (!req.body || !req.body.length){
        context.res.body = `Request body is not defined`;
        context.res.status = HTTP_CODES.BAD_REQUEST
    }

    // Content type is required to know how to parse multi-part form
    if (!req.headers || !req.headers["content-type"]){
        context.res.body = `Content type is not sent in header 'content-type'`;
        context.res.status = HTTP_CODES.BAD_REQUEST
    }    

    context.log(`Filename:${req.query?.filename},Content type:${req.headers["content-type"]}, Length:${req.body.length}`);
    
    if(process?.env?.Environment==='Production' && (!process?.env?.AzureWebJobsStorage || process?.env?.AzureWebJobsStorage.length<10)){
        throw Error("Storage isn't configured correctly - get Storage Connection string from Azure portal");
    }

    try {
        // Each chunk of the file is delimited by a special string
        const bodyBuffer = Buffer.from(req.body);
        const boundary = multipart.getBoundary(req.headers["content-type"]);
        const parts = multipart.Parse(bodyBuffer, boundary);

        // The file buffer is corrupted or incomplete ?
        if (!parts?.length){
            context.res.body = `File buffer is incorrect`;
            context.res.status = HTTP_CODES.BAD_REQUEST
        }

        // filename is a required property of the parse-multipart package
        if(parts[0]?.filename)console.log(`Original filename = ${parts[0]?.filename}`);
        if(parts[0]?.type)console.log(`Content type = ${parts[0]?.type}`);
        if(parts[0]?.data?.length)console.log(`Size = ${parts[0]?.data?.length}`);

        // Passed to Storage
        context.bindings.storage = parts[0]?.data;

        // returned to requestor
        context.res.body = `${process.env.BLOB_STORAGE_CONTAINER}/${parts[0]?.filename}`;
    } catch (err) {
        context.log.error(err.message);
        {
            context.res.body = `${err.message}`;
            context.res.status = HTTP_CODES.INTERNAL_SERVER_ERROR
        }
    }
    return context.res;
};

export default httpTrigger;