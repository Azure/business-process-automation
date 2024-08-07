import { AnalyzeBatchAction, AnalyzeBatchPoller, AzureKeyCredential, PagedAnalyzeBatchResult, TextAnalysisClient } from "@azure/ai-text-analytics";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BpaServiceObject } from "../engine/types";
import { DB } from "./db";
import MessageQueue from "./messageQueue";
import { AnalyzeActionNames } from "@azure/ai-text-analytics";

interface Message {
    Id: string,
    ReferenceId: string,
    Value: string,
    UserId: string,
    EventType: string,
    CustomProperties: string,
    EventTime: string
}

export class LanguageStudio {

    private _endpoint: string
    private _apikey: string
    private _language: string

    constructor(endpoint: string, apikey: string) {
        this._endpoint = endpoint
        this._apikey = apikey
        this._language = "en"
    }

    private _analyze = async (client: TextAnalysisClient, documents, actions: AnalyzeBatchAction[]): Promise<AnalyzeBatchPoller> => {
        return await client.beginAnalyzeBatch(actions, documents, this._language)
    }

    private _recognizeMultiNoReturn = async (input: BpaServiceObject, actions: AnalyzeBatchAction[], type: string, label: string, analyzeType: boolean, index: number): Promise<any[]> => {
        const client = new TextAnalysisClient(this._endpoint, new AzureKeyCredential(this._apikey));
        let poller: AnalyzeBatchPoller
        if (input.data.length === 0) {
            input.data = "no data"
        }

        poller = await this._analyze(client, input.data, actions);

        poller.onProgress(() => {
            console.log(
                `Number of actions still in progress: ${poller.getOperationState().actionInProgressCount}`
            );
        });

        console.log(`The analyze actions operation created on ${poller.getOperationState().createdOn}`);

        console.log(
            `The analyze actions operation results will expire on ${poller.getOperationState().expiresOn}`
        );

        const resultPages: PagedAnalyzeBatchResult = await poller.pollUntilDone();

        let out = []
        for await (const page of resultPages) {
            out.push(page)
        }
        return out;
    }

    private _recognize = async (input: BpaServiceObject, actions: AnalyzeBatchAction[], type: string, label: string, analyzeType: boolean, index: number): Promise<BpaServiceObject> => {
        const client = new TextAnalysisClient(this._endpoint, new AzureKeyCredential(this._apikey));
        let poller: AnalyzeBatchPoller
        if (input.data.length === 0) {
            input.data = "no data"
        }

        poller = await this._analyze(client, [input.data.length > 5000 ? input.data.substring(0, 5000) : input.data], actions);

        poller.onProgress(() => {
            console.log(
                `Number of actions still in progress: ${poller.getOperationState().actionInProgressCount}`
            );
        });

        console.log(`The analyze actions operation created on ${poller.getOperationState().createdOn}`);

        console.log(
            `The analyze actions operation results will expire on ${poller.getOperationState().expiresOn}`
        );

        const resultPages: PagedAnalyzeBatchResult = await poller.pollUntilDone();

        let out = []
        for await (const page of resultPages) {
            out.push(page)
        }
        const results = input.aggregatedResults
        results[type] = out
        input.resultsIndexes.push({ index: index, name: type, type: type })
        const result: BpaServiceObject = {
            data: out,
            type: type,
            label: label,
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

    private _recognizeMultiAsync = async (input: BpaServiceObject, actions: AnalyzeBatchAction[], type: string, label: string, analyzeType: boolean, index: number): Promise<BpaServiceObject> => {
        const client = new TextAnalysisClient(this._endpoint, new AzureKeyCredential(this._apikey));
        let poller: AnalyzeBatchPoller
        if (input.data.length === 0) {
            input.data = "no data"
        }

        poller = await this._analyze(client, input.data, actions);

        input.aggregatedResults[label] = {
            location: JSON.parse(poller.toString()).state.initialRawResponse.headers["operation-location"],
            filename: input.filename
        }

        return {
            index: index,
            type: "async transaction",
            label: label,
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            aggregatedResults: input.aggregatedResults,
            resultsIndexes: input.resultsIndexes,
            id: input.id,
            vector: input.vector
        }
    }

    private _recognizeMulti = async (input: BpaServiceObject, actions: AnalyzeBatchAction[], type: string, label: string, analyzeType: boolean, index: number): Promise<BpaServiceObject> => {
        try {
            let count = 0;
            let inputs = []
            const outputs = []
            for (const item of input.data) { //convert input.data to an array of strings //update, maximum is 5 for pii....5??
                inputs.push(item)
                if (count === 4) {
                    input.data = inputs
                    const piiItems = await this._recognizeMultiNoReturn(input, actions, type, label, analyzeType, index)
                    for (const piiItem of piiItems) {
                        for (const r of piiItem.results) {
                            outputs.push(r)
                        }
                    }
                    inputs = [];
                    count = 0
                }
                count++
            }
            if (inputs.length > 0) { //do the remaining if less than 5
                input.data = inputs
                const piiItems = await this._recognizeMultiNoReturn(input, actions, type, label, analyzeType, index)
                for (const piiItem of piiItems) {
                    for (const r of piiItem.results) {
                        outputs.push(r)
                    }
                }
                inputs = [];
                count = 0
                count++
            }

            const results = input.aggregatedResults
            type = 'piiStt'
            results[type] = outputs
            input.resultsIndexes.push({ index: index, name: type, type: type })
            const result: BpaServiceObject = {
                data: outputs,
                type: type,
                label: label,
                bpaId: input.bpaId,
                filename: input.filename,
                pipeline: input.pipeline,
                aggregatedResults: results,
                resultsIndexes: input.resultsIndexes,
                id: input.id,
                vector: input.vector
            }
            return result
        } catch (err) {
            console.log(err)
        }
    }

    private _recognizeAsync = async (input: BpaServiceObject, actions: AnalyzeBatchAction[], type: string, label: string, analyzeType: boolean, index: number): Promise<BpaServiceObject> => {
        const client = new TextAnalysisClient(this._endpoint, new AzureKeyCredential(this._apikey));
        let poller: AnalyzeBatchPoller
        if (input.data.length === 0) {
            input.data = "no data"
        }

        poller = await this._analyze(client, [input.data.length > 125000 ? input.data.substring(0, 125000) : input.data], actions);

        const pollerString = poller.toString()
        input.aggregatedResults[label] = {
            location: JSON.parse(poller.toString()).state.initialRawResponse.headers["operation-location"],
            filename: input.filename
        }

        return {
            index: index,
            type: "async transaction",
            label: label,
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            aggregatedResults: input.aggregatedResults,
            resultsIndexes: input.resultsIndexes,
            id: input.id,
            vector: input.vector
        }
    }

    public processAsync = async (mySbMsg: any, db: DB, mq: MessageQueue): Promise<void> => {

        const axiosParams: AxiosRequestConfig = {
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": this._apikey
            }
        }
        let httpResult = 200
        let axiosGetResp: AxiosResponse

        axiosGetResp = await axios.get(mySbMsg.aggregatedResults[mySbMsg.label].location, axiosParams)
        httpResult = axiosGetResp.status
        if ((axiosGetResp?.data?.status && axiosGetResp.data.status === 'Failed') || (httpResult <= 200 && httpResult >= 299)) {
            mySbMsg.type = 'async failed'
            mySbMsg.data = axiosGetResp.data
            await db.create(mySbMsg)
            throw new Error(`failed : ${JSON.stringify(axiosGetResp.data)}`)
        } else if (axiosGetResp?.data?.status && axiosGetResp.data.status === 'succeeded') {
            mySbMsg.type = 'async completion'
            if (mySbMsg.label === 'healthCare') {
                mySbMsg.aggregatedResults[mySbMsg.label] = axiosGetResp.data
                mySbMsg.data = axiosGetResp.data
            } else {
                mySbMsg.aggregatedResults[mySbMsg.label] = axiosGetResp.data.tasks
                mySbMsg.data = axiosGetResp.data.tasks
            }

            mySbMsg.resultsIndexes.push({ index: mySbMsg.index, name: mySbMsg.label, type: mySbMsg.label })
            mySbMsg.type = mySbMsg.label
            mySbMsg.index = mySbMsg.index + 1


            const dbout = await db.create(mySbMsg)
            //mySbMsg.dbId = dbout.id
            //mySbMsg.aggregatedResults[mySbMsg.label] = dbout.id
            //mySbMsg.data = dbout.id

            await mq.sendMessage({ filename: mySbMsg.filename, id: mySbMsg.id, pipeline: mySbMsg.pipeline, label: mySbMsg.label, type: mySbMsg.type })
        } else {
            console.log('do nothing')
            await mq.scheduleMessage({ filename: mySbMsg.filename, id: mySbMsg.id, pipeline: mySbMsg.pipeline, label: mySbMsg.label, type: mySbMsg.type }, 10000)
        }
    }

    public recognizeEntities = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: AnalyzeActionNames.EntityRecognition
            }]
        return await this._recognize(input, actions, 'recognizeEntities', 'recognizeEntities', true, index)
    }

    public recognizePiiEntities = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: AnalyzeActionNames.PiiEntityRecognition
            }]

        return await this._recognize(input, actions, 'recognizePiiEntities', 'recognizePiiEntities', true, index)
    }

    public piiToText = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        let out = ""
        for (const item of input.data.items) {
            for (const document of item.results.documents) {
                out += " " + document.redactedText
            }
        }

        const results = input.aggregatedResults
        input.aggregatedResults.piiToText = out
        input.resultsIndexes.push({ index: index, name: "piiToText", type: "text" })
        const result: BpaServiceObject = {
            data: out,
            type: 'text',
            label: 'piiToText',
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

    public piiStt = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [{
            kind: AnalyzeActionNames.PiiEntityRecognition
        }]

        const listOfStrings = []
        for (const item of input.data) { //convert input.data to an array of strings //update, maximum is 5....5??
            listOfStrings.push(item.nBest[0].display)
        }
        input.data = listOfStrings
        return await this._recognizeMulti(input, actions, 'recognizePiiEntities', 'recognizePiiEntities', true, index)
        //return await this._recognizeMultiAsync(input, actions, 'recognizePiiEntities', 'recognizePiiEntities', true, index)
    }



    public formatKMAccelerator = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        const messages: Message[] = []
        for (const m of input.data) {
            let out: Message = {
                Id: "",
                ReferenceId: "",
                Value: "",
                UserId: "",
                EventType: "",
                CustomProperties: "",
                EventTime: ""
            }

            out.Id = input.data.id
            out.ReferenceId = null,
                out.Value = m.nBest[0].display
            out.UserId = String(input.data.speaker)
            out.EventType = (input.data.speaker === 0) ? "MessageFromUser" : "MessageFromBotOrAgent",
                out.CustomProperties = JSON.stringify({
                    offset: 0,
                    duration: 0,
                    offsetInTicks: 0,
                    durationInTicks: 0
                })

            messages.push(out)

        }

        const out = { Messages: messages }

        const results = input.aggregatedResults
        input.aggregatedResults.formatKMAccelerator = out
        input.resultsIndexes.push({ index: index, name: "formatKMAccelerator", type: "formatKMAccelerator" })
        let result: BpaServiceObject = {
            data: out,
            type: 'formatKMAccelerator',
            label: 'formatKMAccelerator',
            bpaId: input.bpaId,
            filename: input.filename,
            pipeline: input.pipeline,
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes,
            id: input.id,
            vector: input.vector
        }

        result["Messages"] = messages

        return result

    }

    public extractKeyPhrases = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: AnalyzeActionNames.KeyPhraseExtraction
            }]

        return await this._recognize(input, actions, 'extractKeyPhrases', 'extractKeyPhrases', true, index)
    }

    public recognizeLinkedEntities = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: AnalyzeActionNames.EntityLinking
            }]

        return await this._recognize(input, actions, 'recognizeLinkedEntities', 'recognizeLinkedEntities', true, index)
    }

    public analyzeSentiment = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: AnalyzeActionNames.SentimentAnalysis
            }]

        return await this._recognize(input, actions, 'analyzeSentiment', 'analyzeSentiment', true, index)
    }

    public recognizeEntitiesAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: AnalyzeActionNames.EntityRecognition
            }]

        return await this._recognizeAsync(input, actions, 'recognizeEntities', 'recognizeEntities', true, index)
    }

    public recognizePiiEntitiesAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: AnalyzeActionNames.PiiEntityRecognition
            }]
        return await this._recognizeAsync(input, actions, 'recognizePiiEntities', 'recognizePiiEntities', true, index)
    }

    public extractKeyPhrasesAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: AnalyzeActionNames.KeyPhraseExtraction
            }]

        return await this._recognizeAsync(input, actions, 'extractKeyPhrases', 'extractKeyPhrases', true, index)
    }

    public recognizeLinkedEntitiesAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: AnalyzeActionNames.EntityLinking
            }]

        return await this._recognizeAsync(input, actions, 'recognizeLinkedEntities', 'recognizeLinkedEntities', true, index)
    }

    public analyzeSentimentAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: AnalyzeActionNames.SentimentAnalysis
            }]

        return await this._recognizeAsync(input, actions, 'analyzeSentiment', 'analyzeSentiment', true, index)
    }


    public summaryToText = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        let out = ""
        const mytasks = input.data.extractiveSummarizationTasks
        for (const task of input.data.extractiveSummarizationTasks) {
            for (const document of task.results.documents) {
                for (const sentence of document.sentences) {
                    out += " " + sentence.text
                }
            }
        }


        const results = input.aggregatedResults
        results["summaryToText"] = out
        input.resultsIndexes.push({ index: index, name: "summaryToText", type: "summaryToText" })
        return {
            data: out,
            type: "text",
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            label: "summaryToText",
            aggregatedResults: results,
            resultsIndexes: input.resultsIndexes,
            id: input.id,
            vector: input.vector
        }
    }

    public extractSummary = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: "ExtractiveSummarization"
            }]

        return await this._recognize(input, actions, 'extractSummary', 'extractSummary', true, index)
    }

    public recognizeCustomEntities = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: "CustomEntityRecognition",
                deploymentName: input.serviceSpecificConfig.deploymentName,
                projectName: input.serviceSpecificConfig.projectName
            }]

        return await this._recognize(input, actions, 'recognizeCustomEntities', 'recognizeCustomEntities', true, index)
    }

    public singleCategoryClassify = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: "CustomSingleLabelClassification",
                deploymentName: input.serviceSpecificConfig.deploymentName,
                projectName: input.serviceSpecificConfig.projectName
            }]

        return await this._recognize(input, actions, 'singleCategoryClassify', 'singleCategoryClassify', true, index)
    }

    public multiCategoryClassify = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: "CustomMultiLabelClassification",
                deploymentName: input.serviceSpecificConfig.deploymentName,
                projectName: input.serviceSpecificConfig.projectName
            }]

        return await this._recognize(input, actions, 'multiCategoryClassify', 'multiCategoryClassify', true, index)
    }

    public healthCare = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: "Healthcare"
            }]
        return await this._recognize(input, actions, 'healthCare', 'healthCare', false, index)
    }

    public healthCareAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: "Healthcare"
            }]

        return await this._recognizeAsync(input, actions, 'healthCare', 'healthCare', false, index)
    }

    public extractSummaryAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: "ExtractiveSummarization"
            }]

        return await this._recognizeAsync(input, actions, 'extractSummary', 'extractSummary', true, index)
    }

    public recognizeCustomEntitiesAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: "CustomEntityRecognition",
                deploymentName: input.serviceSpecificConfig.deploymentName,
                projectName: input.serviceSpecificConfig.projectName
            }]

        return await this._recognizeAsync(input, actions, 'recognizeCustomEntities', 'recognizeCustomEntities', true, index)
    }

    public singleCategoryClassifyAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: "CustomSingleLabelClassification",
                deploymentName: input.serviceSpecificConfig.deploymentName,
                projectName: input.serviceSpecificConfig.projectName
            }]

        return await this._recognizeAsync(input, actions, 'singleCategoryClassify', 'singleCategoryClassify', true, index)
    }

    public multiCategoryClassifyAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: AnalyzeBatchAction[] = [
            {
                kind: "CustomMultiLabelClassification",
                deploymentName: input.serviceSpecificConfig.deploymentName,
                projectName: input.serviceSpecificConfig.projectName
            }]

        return await this._recognizeAsync(input, actions, 'multiCategoryClassify', 'multiCategoryClassify', true, index)
    }


}