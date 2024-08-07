import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BpaServiceObject } from "../engine/types";

export class OpenAI {


    private _endpoint: string
    private _apikey: string
    private _deploymentId: string

    constructor(endpoint: string, apikey: string, deploymentId: string) {
        this._apikey = apikey
        this._endpoint = endpoint
        this._deploymentId = deploymentId
    }

    public process = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const headers = {
            'api-key': this._apikey,
            'Content-Type': 'application/json'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        let url = `${this._endpoint}openai/deployments/${this._deploymentId}/chat/completions?api-version=2023-05-15`

        const prompt = "Content: " + input.data.slice(0, 4000) + "\n\nProvide a brief summary of the above content.\n\nSummary: "
        const openAiInput = { "messages": [{ "role": "user", "content": prompt }] }
        let out = await axios.post(url, openAiInput, config)

        const results = input.aggregatedResults
        if (results?.openaiSummarize) {
            results["openaiSummarize"].push(out.data)
        } else {
            results["openaiSummarize"] = [out.data]
        }


        const result: BpaServiceObject = {
            data: out.data,
            type: 'openaiChatCompletion',
            label: 'openaiSummarize',
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes,
            id: input.id,
            vector: input.vector
        }

        return result
    }

    public openaiToText = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        const text = input.data.choices[0].message[0].content

        const results = input.aggregatedResults
        input.aggregatedResults["openaiToText"] = text
        input.resultsIndexes.push({ index: index, name: "openaiToText", type: "text" })
        const result: BpaServiceObject = {
            data: text,
            type: 'text',
            label: 'openaiToText',
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes,
            id: input.id,
            vector: input.vector
        }
        return result
    }

    public processGeneric = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {


        const headers = {
            'api-key': this._apikey,
            'Content-Type': 'application/json'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        let url = `${this._endpoint}openai/deployments/${this._deploymentId}/chat/completions?api-version=2023-05-15`

        const prompt = input.serviceSpecificConfig.replace(/(\r\n|\n|\r|\t)/gm, " ").replace("${document}", input.data)
        const openAiInput = { "messages": [{ "role": "user", "content": prompt }] }
        let out = await axios.post(url, openAiInput, config)

        const results = input.aggregatedResults
        if (results?.openaiGeneric) {
            results["openaiGeneric"].push(out.data)
        } else {
            results["openaiGeneric"] = [out.data]
        }
        input.resultsIndexes.push({ index: index, name: "openaiGeneric", type: "openaiChatCompletion" })
        const result: BpaServiceObject = {
            data: out.data,
            type: 'openaiChatCompletion',
            label: 'openaiGeneric',
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes,
            id: input.id,
            vector: input.vector
        }
        return result

    }

    public processRest = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const headers = {
            'api-key': this._apikey,
            'Content-Type': 'application/json'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        const body = input.serviceSpecificConfig.replace(/(\r\n|\n|\r|\t)/gm, " ").replace("${document}", input.data.replace(/(\r\n|\n|\r|\t|}|{|"|')/gm, " "))
        const parsedBody = JSON.parse(body)

        let url = `${this._endpoint}openai/deployments/${this._deploymentId}/chat/completions?api-version=2023-05-15`
        let out = await axios.post(url, parsedBody, config)

        const results = input.aggregatedResults
        if (results?.openaiGeneric) {
            results["openaiRest"].push(out.data)
        } else {
            results["openaiRest"] = [out.data]
        }
        input.resultsIndexes.push({ index: index, name: "openaiRest", type: "openaiChatCompletion" })
        const result: BpaServiceObject = {
            data: out.data,
            type: 'openaiChatCompletion',
            label: 'openaiRest',
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes,
            id: input.id,
            vector: input.vector
        }
        return result

    }

    public piiToProcessRest = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const headers = {
            'api-key': this._apikey,
            'Content-Type': 'application/json'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        const redactedText: string[] = []
        //let redactedTextIndex = 0
        for (const item of input.data) {
            // for (const document of item.results.documents) {
            //     if (redactedText[redactedTextIndex].length > 5000) {
            //         redactedTextIndex++
            //         redactedText.push("")
            //     }
            redactedText.push(item.redactedText)
            //   redactedTextIndex++
            
        }

        const out = []
        for (const text of redactedText) {
            const body = input.serviceSpecificConfig.replace(/(\r\n|\n|\r|\t)/gm, " ").replace("${document}", text.replace(/(\r\n|\n|\r|\t|}|{|"|')/gm, " "))
            const parsedBody = JSON.parse(body)

            let url = `${this._endpoint}openai/deployments/${this._deploymentId}/chat/completions?api-version=2023-05-15`
            out.push((await axios.post(url, parsedBody, config)).data)
        }


        const results = input.aggregatedResults
        if (results?.openaiGeneric) {
            results["openaiRest"].push(out)
        } else {
            results["openaiRest"] = [out]
        }
        input.resultsIndexes.push({ index: index, name: "openaiRest", type: "openaiChatCompletion" })
        const result: BpaServiceObject = {
            data: out,
            type: 'openaiChatCompletionMulti',
            label: 'piiToOpenaiRest',
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes,
            id: input.id,
            vector: input.vector
        }
        return result

    }

    public convertToChatCopilot = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        const out = {
            data: "",
            type: 'convertToCopilot',
            label: 'convertToCopilot',
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            aggregatedResults: input.aggregatedResults,
            resultsIndexes: input.resultsIndexes,
            id: input.id,
            vector: input.vector,
            Id: input.id,
            Embedding: input.vector,
            Text: input.aggregatedResults.text,
            Description: input.filename,
            AdditionalMetadata: "",
            ExternalSourceName: "",
            IsReference: false
        }

        return out

    }

    public generic = async (prompt: string, maxTokens: number): Promise<any> => {
        const headers = {
            'api-key': this._apikey,
            'Content-Type': 'application/json'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        let url = `${this._endpoint}openai/deployments/${this._deploymentId}/chat/completions?api-version=2023-03-15-preview`

        const openAiInput = {
            "messages": { "role": "user", "content": prompt }
        }

        const out = await axios.post(url, openAiInput, config)
        return out.data
    }

    public getEmbeddings = async (text: string): Promise<AxiosResponse<any, any>> => {
        const headers = {
            'api-key': this._apikey,
            'Content-Type': 'application/json'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        let url = `${this._endpoint}openai/deployments/${this._deploymentId}/embeddings?api-version=2022-12-01`

        const truncatedString = text.slice(0, 3500)

        const openAiInput = {
            "input": truncatedString
        }

        const out = await axios.post(url, openAiInput, config)
        return out.data
    }

    public processEmbeddings = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {


        const headers = {
            'api-key': this._apikey,
            'Content-Type': 'application/json'
        }

        const config: AxiosRequestConfig = {
            headers: headers
        }

        let url = `${this._endpoint}openai/deployments/${this._deploymentId}/embeddings?api-version=2022-12-01`

        const truncatedString = input.data.slice(0, 2000)

        const openAiInput = {
            "input": truncatedString
        }

        const out = await axios.post(url, openAiInput, config)
        const results = input.aggregatedResults
        results["openaiEmbeddings"] = out.data
        input.resultsIndexes.push({ index: index, name: "openaiEmbeddings", type: "openaiEmbeddings" })
        const result: BpaServiceObject = {
            data: out.data,
            type: 'openaiEmbeddings',
            label: 'openaiEmbeddings',
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes,
            id: input.id,
            vector: out.data.data[0].embedding
        }
        return result

    }
}