import { ComputerVisionClient, ComputerVisionModels } from "@azure/cognitiveservices-computervision"
import { ApiKeyCredentials } from "@azure/ms-rest-js"
import { BpaServiceObject } from "../engine/types";

export class Ocr {

    private _client: ComputerVisionClient

    constructor(endpoint: string, apikey: string) {
        this._client = new ComputerVisionClient(
            new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': apikey } }), endpoint);
    }

    private sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public process = async (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {
        const readResult : ComputerVisionModels.ReadResult[] = await this.execute(input.data)
        const textOut : string = this.toText(readResult)
        const results = input.aggregatedResults
        results["ocr"] = textOut
        input.resultsIndexes.push({index : index, name : "ocr", type : "text"})
        const result : BpaServiceObject = {
            data : textOut,
            type : 'text',
            label : 'ocr',
            bpaId : input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            aggregatedResults : results,
            resultsIndexes : input.resultsIndexes
        }
        return result
    }

    public execute = async (fileBuffer: Buffer): Promise<ComputerVisionModels.ReadResult[]> => {
        try { 
            let fileStream = await this._client.readInStream(fileBuffer);
            //Operation ID is last path segment of operationLocation (a URL)
            let operation: string = fileStream.operationLocation.split('/').slice(-1)[0];
            // Wait for read recognition to complete
            // result.status is initially undefined, since it's the result of read
            let status: string = ''
            let result: ComputerVisionModels.GetReadResultResponse = null
            while (status !== 'succeeded') {
                console.log("in ocr read loop")
                result = await this._client.getReadResult(operation);
                status = result.status
                console.log(`ocr status: ${status}`)
                await this.sleep(1000);
            }
            console.log("completed")
            return result.analyzeResult.readResults;
        } catch (err) {
            console.log(`error in ocr execute ${err}`)
        }
        return null
    }

    public toText = (results: ComputerVisionModels.ReadResult[]): string => {
        console.log(`converting ocr output to string`)
        let outString = ""
        for (const page of results) {
            for (const line of page.lines) {
                outString += " " + line.text
            }
        }
        return outString.replace('[A-Za-z0-9 *!$%&()?<>{}]+', '')
    }
}