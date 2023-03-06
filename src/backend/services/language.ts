import { TextAnalyticsActions, TextAnalyticsClient, AzureKeyCredential, PagedAnalyzeActionsResult, AnalyzeActionsPollerLike, AnalyzeHealthcareEntitiesPollerLike } from "@azure/ai-text-analytics";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BpaServiceObject } from "../engine/types";
import { DB } from "./db";
import MessageQueue from "./messageQueue";

export class LanguageStudio {

    private _endpoint: string
    private _apikey: string
    private _language: string

    constructor(endpoint: string, apikey: string) {
        this._endpoint = endpoint
        this._apikey = apikey
        this._language = "en"
    }

    private _healthCare = async (client: TextAnalyticsClient, documents): Promise<AnalyzeHealthcareEntitiesPollerLike> => {
        return await client.beginAnalyzeHealthcareEntities(documents, this._language, {
            includeStatistics: true
        });
    }

    private _analyze = async (client: TextAnalyticsClient, documents: string[], actions): Promise<AnalyzeActionsPollerLike> => {
        return await client.beginAnalyzeActions(documents, actions, this._language);
    }

    private _recognize = async (input: BpaServiceObject, actions: TextAnalyticsActions, type: string, label: string, analyzeType: boolean, index: number): Promise<BpaServiceObject> => {
        const client = new TextAnalyticsClient(this._endpoint, new AzureKeyCredential(this._apikey));
        let poller
        if(input.data.length === 0){
            input.data = "no data"
        }
        if (analyzeType) {
            poller = await this._analyze(client, [input.data.length > 5000 ? input.data.substring(0, 5000) : input.data], actions);
        } else {
            poller = await this._healthCare(client, [input.data.length > 5000 ? input.data.substring(0, 5000) : input.data])
        }

        poller.onProgress(() => {
            console.log(
                `Number of actions still in progress: ${poller.getOperationState().actionsInProgressCount}`
            );
        });

        console.log(`The analyze actions operation created on ${poller.getOperationState().createdOn}`);

        console.log(
            `The analyze actions operation results will expire on ${poller.getOperationState().expiresOn}`
        );

        const resultPages: PagedAnalyzeActionsResult = await poller.pollUntilDone();

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
            resultsIndexes: input.resultsIndexes
        }
        return result
    }

    private _recognizeAsync = async (input: BpaServiceObject, actions: TextAnalyticsActions, type: string, label: string, analyzeType: boolean, index: number): Promise<BpaServiceObject> => {
        const client = new TextAnalyticsClient(this._endpoint, new AzureKeyCredential(this._apikey));
        let poller
        if(input.data.length === 0){
            input.data = "no data"
        }
        if (analyzeType) {
            poller = await this._analyze(client, [input.data.length > 125000 ? input.data.substring(0, 125000) : input.data], actions);
        } else {
            poller = await this._healthCare(client, [input.data.length > 125000 ? input.data.substring(0, 125000) : input.data])
        }

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
            resultsIndexes: input.resultsIndexes
        }

        // poller.onProgress(() => {
        //     console.log(
        //         `Number of actions still in progress: ${poller.getOperationState().actionsInProgressCount}`
        //     );
        // });

        // console.log(`The analyze actions operation created on ${poller.getOperationState().createdOn}`);

        // console.log(
        //     `The analyze actions operation results will expire on ${poller.getOperationState().expiresOn}`
        // );

        // const resultPages: PagedAnalyzeActionsResult = await poller.pollUntilDone();

        // let out = []
        // for await (const page of resultPages) {
        //     out.push(page)
        // }
        // const results = input.aggregatedResults
        // results[type] = out
        // input.resultsIndexes.push({ index: index, name: type, type: type })
        // const result: BpaServiceObject = {
        //     data: out,
        //     type: type,
        //     label: label,
        //     bpaId: input.bpaId,
        //     filename: input.filename,
        //     pipeline: input.pipeline,
        //     aggregatedResults: results,
        //     resultsIndexes: input.resultsIndexes
        // }
        // return result
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
            if(mySbMsg.label === 'healthCare'){
                mySbMsg.aggregatedResults[mySbMsg.label] = axiosGetResp.data
                mySbMsg.data = axiosGetResp.data
            } else{
                mySbMsg.aggregatedResults[mySbMsg.label] = axiosGetResp.data.tasks
                mySbMsg.data = axiosGetResp.data.tasks
            }
            
            mySbMsg.resultsIndexes.push({ index: mySbMsg.index, name: mySbMsg.label, type: mySbMsg.label })
            mySbMsg.type = mySbMsg.label
            mySbMsg.index = mySbMsg.index + 1
           

            const dbout = await db.create(mySbMsg)
            mySbMsg.dbId = dbout.id
            mySbMsg.aggregatedResults[mySbMsg.label] = dbout.id
            mySbMsg.data = dbout.id

            await mq.sendMessage(mySbMsg)
        } else {
            console.log('do nothing')
            await mq.scheduleMessage(mySbMsg, 10000)
        }
    }

    public recognizeEntities = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            recognizeEntitiesActions: [{ modelVersion: "latest" }]
        };

        return await this._recognize(input, actions, 'recognizeEntities', 'recognizeEntities', true, index)
    }

    public recognizePiiEntities = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            recognizePiiEntitiesActions: [{ modelVersion: "latest" }]
        };

        return await this._recognize(input, actions, 'recognizePiiEntities', 'recognizePiiEntities', true, index)
    }

    public extractKeyPhrases = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            extractKeyPhrasesActions: [{ modelVersion: "latest" }]
        };

        return await this._recognize(input, actions, 'extractKeyPhrases', 'extractKeyPhrases', true, index)
    }

    public recognizeLinkedEntities = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            recognizeLinkedEntitiesActions: [{ modelVersion: "latest" }]
        };

        return await this._recognize(input, actions, 'recognizeLinkedEntities', 'recognizeLinkedEntities', true, index)
    }

    public analyzeSentiment = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            analyzeSentimentActions: [{ modelVersion: "latest" }]
        };

        return await this._recognize(input, actions, 'analyzeSentiment', 'analyzeSentiment', true, index)
    }

    public recognizeEntitiesAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            recognizeEntitiesActions: [{ modelVersion: "latest" }]
        };

        return await this._recognizeAsync(input, actions, 'recognizeEntities', 'recognizeEntities', true, index)
    }

    public recognizePiiEntitiesAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            recognizePiiEntitiesActions: [{ modelVersion: "latest" }]
        };

        return await this._recognizeAsync(input, actions, 'recognizePiiEntities', 'recognizePiiEntities', true, index)
    }

    public extractKeyPhrasesAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            extractKeyPhrasesActions: [{ modelVersion: "latest" }]
        };

        return await this._recognizeAsync(input, actions, 'extractKeyPhrases', 'extractKeyPhrases', true, index)
    }

    public recognizeLinkedEntitiesAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            recognizeLinkedEntitiesActions: [{ modelVersion: "latest" }]
        };

        return await this._recognizeAsync(input, actions, 'recognizeLinkedEntities', 'recognizeLinkedEntities', true, index)
    }

    public analyzeSentimentAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            analyzeSentimentActions: [{ modelVersion: "latest" }]
        };

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
            resultsIndexes: input.resultsIndexes
        }
    }

    public extractSummary = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            extractSummaryActions: [{ modelVersion: "latest" }]
        };

        //let out = ""
        return await this._recognize(input, actions, 'extractSummary', 'extractSummary', true, index)
        // for(const page of summaryResults.data){
        //     for(const result of page.extractSummaryResults[0].results){
        //         for(const sentence of result.sentences){
        //             out += " " + sentence.text
        //         }
        //     }
        // }

        // const results = input.aggregatedResults
        // results["extractSummary"] = out
        // input.resultsIndexes.push({index : index, name : "extractSummary", type : "extractSummary"})
        // return {
        //     data : out,
        //     type : "text",
        //     filename: input.filename,
        //     pipeline: input.pipeline,
        //     bpaId : input.bpaId,
        //     label : "extractSummary",
        //     aggregatedResults : results,
        //     resultsIndexes : input.resultsIndexes
        // }
    }

    public recognizeCustomEntities = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            recognizeCustomEntitiesActions: [{ projectName: input.serviceSpecificConfig.projectName, deploymentName: input.serviceSpecificConfig.deploymentName }]
        };

        return await this._recognize(input, actions, 'recognizeCustomEntities', 'recognizeCustomEntities', true, index)
    }

    public singleCategoryClassify = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            singleCategoryClassifyActions: [{ projectName: input.serviceSpecificConfig.projectName, deploymentName: input.serviceSpecificConfig.deploymentName }]
        };

        return await this._recognize(input, actions, 'singleCategoryClassify', 'singleCategoryClassify', true, index)
    }

    public multiCategoryClassify = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            multiCategoryClassifyActions: [{ projectName: input.serviceSpecificConfig.projectName, deploymentName: input.serviceSpecificConfig.deploymentName }]
        };

        return await this._recognize(input, actions, 'multiCategoryClassify', 'multiCategoryClassify', true, index)
    }

    public healthCare = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            multiCategoryClassifyActions: [{ projectName: input.serviceSpecificConfig.projectName, deploymentName: input.serviceSpecificConfig.deploymentName }]
        };

        return await this._recognize(input, actions, 'healthCare', 'healthCare', false, index)
    }

    public healthCareAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            multiCategoryClassifyActions: [{ projectName: input.serviceSpecificConfig.projectName, deploymentName: input.serviceSpecificConfig.deploymentName }]
        };

        return await this._recognizeAsync(input, actions, 'healthCare', 'healthCare', false, index)
    }

    public extractSummaryAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            extractSummaryActions: [{ modelVersion: "latest" }]
        };

        //let out = ""
        return await this._recognizeAsync(input, actions, 'extractSummary', 'extractSummary', true, index)
        // for(const page of summaryResults.data){
        //     for(const result of page.extractSummaryResults[0].results){
        //         for(const sentence of result.sentences){
        //             out += " " + sentence.text
        //         }
        //     }
        // }

        // const results = input.aggregatedResults
        // results["extractSummary"] = out
        // input.resultsIndexes.push({index : index, name : "extractSummary", type : "extractSummary"})
        // return {
        //     data : out,
        //     type : "text",
        //     filename: input.filename,
        //     pipeline: input.pipeline,
        //     bpaId : input.bpaId,
        //     label : "extractSummary",
        //     aggregatedResults : results,
        //     resultsIndexes : input.resultsIndexes
        // }
    }

    public recognizeCustomEntitiesAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            recognizeCustomEntitiesActions: [{ projectName: input.serviceSpecificConfig.projectName, deploymentName: input.serviceSpecificConfig.deploymentName }]
        };

        return await this._recognizeAsync(input, actions, 'recognizeCustomEntities', 'recognizeCustomEntities', true, index)
    }

    public singleCategoryClassifyAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            singleCategoryClassifyActions: [{ projectName: input.serviceSpecificConfig.projectName, deploymentName: input.serviceSpecificConfig.deploymentName }]
        };

        return await this._recognizeAsync(input, actions, 'singleCategoryClassify', 'singleCategoryClassify', true, index)
    }

    public multiCategoryClassifyAsync = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const actions: TextAnalyticsActions = {
            multiCategoryClassifyActions: [{ projectName: input.serviceSpecificConfig.projectName, deploymentName: input.serviceSpecificConfig.deploymentName }]
        };

        return await this._recognizeAsync(input, actions, 'multiCategoryClassify', 'multiCategoryClassify', true, index)
    }


}