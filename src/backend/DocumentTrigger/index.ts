import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import fs from "fs";
import p from "path"
import * as multipart from "parse-multipart";
const _ = require('lodash')

const documentTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {

        var body = req.body;
        var boundary = req.headers["content-type"].split("boundary=")[1];

        context.log(`headers : ${JSON.stringify(req.headers)}`)
        var parts = multipart.Parse(body, boundary);
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            context.log(`type : ${part.type}`)
            context.log(`filename : ${part.filename}`)
            // will be:
            // { filename: 'A.txt', type: 'text/plain', 
            //		data: <Buffer 41 41 41 41 42 42 42 42> }
            const split = p.join(process.env.LOCAL_STORAGE_DIR, req.query.filename).split('/')
            const dir = p.join(process.env.LOCAL_STORAGE_DIR, req.query.filename).replace(split[split.length - 1], '')
            context.log('making dir ' + dir)
            context.log(part.type)
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir)
            }
            if(!fs.existsSync(p.join(process.env.LOCAL_STORAGE_DIR, req.query.filename))){
                fs.writeFileSync(p.join(process.env.LOCAL_STORAGE_DIR, req.query.filename), part.data)
            }
        }
        
        context.res = {
            status: 200
        }
    }
    catch (err) {
        context.log(err)
        context.res = {
            status: 500,
            body: err.message
        }
    }
};

export default documentTrigger;