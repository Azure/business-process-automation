import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { BpaServiceObject } from '../engine/types'
import { BlobServiceClient, ContainerClient, BlockBlobClient, ContainerGenerateSasUrlOptions, ContainerSASPermissions } from "@azure/storage-blob"

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { DB } from "./db";
import MessageQueue from "./messageQueue";


export class Speech {

    private _client: sdk.SpeechConfig
    private _blobServiceClient: BlobServiceClient
    private _blobContainerClient: ContainerClient

    constructor(subscriptionKey: string, region: string, connectionString: string, containerName: string, cosmosConnectionString: string, cosmosDb: string, cosmosContainer: string) {
        this._client = sdk.SpeechConfig.fromSubscription(subscriptionKey, region)
        //const url : URL = new URL(process.env.SPEECH_SUB_ENDPOINT)
        //this._client = sdk.SpeechConfig.fromHost(url, subscriptionKey)
        this._client.setProfanity(sdk.ProfanityOption.Raw)
        this._blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        this._blobContainerClient = this._blobServiceClient.getContainerClient(containerName);
    }

    private _delay = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public processBatch = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        console.log("kicking off stt batch.......")

        const options: ContainerGenerateSasUrlOptions = {
            permissions: ContainerSASPermissions.parse("r"),
            expiresOn: new Date(new Date().valueOf() + (1000 * 60 * 60 * 24)),
        }
        const filename = input.filename.replace("documents/", "")

        // let httpResult = 429
        let axiosResp: AxiosResponse
        const blobClient: BlockBlobClient = this._blobContainerClient.getBlockBlobClient(filename) // can throw 429
        const sasUrl = await blobClient.generateSasUrl(options)
        let payload = {
            "contentUrls": [
                sasUrl
            ],
            "properties": {
                "wordLevelTimestampsEnabled": true
            },
            "locale": "en-US",
            "displayName": "Transcription of file using default model for en-US"
        }
        if (input?.serviceSpecificConfig?.to) {
            payload = {
                "contentUrls": [
                    sasUrl
                ],
                "properties": {
                    "wordLevelTimestampsEnabled": true
                },
                "locale": input.serviceSpecificConfig.to,
                "displayName": "Transcription of file using default model for en-US"
            }
        }
        const axiosParams: AxiosRequestConfig = {
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": process.env.SPEECH_SUB_KEY
            }
        }
        axiosResp = await axios.post(process.env.SPEECH_SUB_ENDPOINT + 'speechtotext/v3.0/transcriptions', payload, axiosParams)
        //httpResult = axiosResp.status

        input.aggregatedResults["speechToText"] = {
            location: axiosResp.headers.location,
            stage: "stt",
            filename: input.filename
        }

        return {
            index: index,
            type: "async transaction",
            label: input.label,
            filename: input.filename,
            pipeline: input.pipeline,
            bpaId: input.bpaId,
            aggregatedResults: input.aggregatedResults,
            resultsIndexes: input.resultsIndexes
        }
    }

    public process = (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        console.log("kicking off stt .......")
        return new Promise<BpaServiceObject>((resolve, reject) => {


            if (input?.serviceSpecificConfig?.to) {
                this._client.speechRecognitionLanguage = input.serviceSpecificConfig.to
            }
            let audioConfig = sdk.AudioConfig.fromWavFileInput(input.data);
            let speechRecognizer = new sdk.SpeechRecognizer(this._client, audioConfig);

            let out = ""
            speechRecognizer.recognizing = (s, e) => {
                //console.log(`RECOGNIZING: Text=${e.result.text}`);
            };

            speechRecognizer.recognized = (s, e) => {
                if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
                    //console.log(`RECOGNIZED: Text=${e.result.text}`);
                    out += e.result.text + " "
                }
                else if (e.result.reason == sdk.ResultReason.NoMatch) {
                    console.log("NOMATCH: Speech could not be recognized.");
                }
            };

            speechRecognizer.canceled = (s, e) => {
                console.log(`CANCELED: Reason=${e.reason}`);

                if (e.reason === sdk.CancellationReason.Error) {
                    console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
                    console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
                    console.log("CANCELED: Did you set the speech resource key and region values?");
                    reject(new Error(e.errorDetails))
                }
            };

            speechRecognizer.sessionStopped = (s, e) => {
                console.log("\n    Session stopped event.");
                speechRecognizer.stopContinuousRecognitionAsync();
                const results = input.aggregatedResults
                results["speechToText"] = out
                input.resultsIndexes.push({ index: index, name: "speechToText", type: "text" })
                resolve({
                    data: out,
                    label: "speechToText",
                    bpaId: input.bpaId,
                    type: 'text',
                    filename: input.filename,
                    pipeline: input.pipeline,
                    aggregatedResults: results,
                    resultsIndexes: input.resultsIndexes
                })
            };


            speechRecognizer.startContinuousRecognitionAsync();

        })
    }

    public processAsync = async (mySbMsg: any, db: DB, mq: MessageQueue): Promise<void> => {

        const axiosParams: AxiosRequestConfig = {
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": process.env.SPEECH_SUB_KEY
            }
        }
        let httpResult = 200
        let axiosGetResp: AxiosResponse

        axiosGetResp = await axios.get(mySbMsg.aggregatedResults["speechToText"].location, axiosParams)
        httpResult = axiosGetResp.status
        if ((axiosGetResp?.data?.status && axiosGetResp.data.status === 'Failed') || (httpResult <= 200 && httpResult >= 299)) {
            mySbMsg.type = 'async failed'
            mySbMsg.data = axiosGetResp.data
            await db.create(mySbMsg)
            throw new Error(`failed : ${JSON.stringify(axiosGetResp.data)}`)
        } else if (axiosGetResp?.data?.status && axiosGetResp.data.status === 'Succeeded' && axiosGetResp?.data?.links?.files) {
            mySbMsg.type = 'async completion'
            let axiosGetResp2: AxiosResponse

            axiosGetResp2 = await axios.get(axiosGetResp.data.links.files, axiosParams)
            httpResult = axiosGetResp2.status
            for (const value of axiosGetResp2.data.values) {
                if (value.kind === 'Transcription') {
                    const axiosGetResp3 = await axios.get(value.links.contentUrl, axiosParams)
                    let result = ""
                    for (const combined of axiosGetResp3.data.combinedRecognizedPhrases) {
                        result += " " + combined.display
                    }
                    let index = mySbMsg.index
                    mySbMsg.aggregatedResults["speechToText"] = result
                    mySbMsg.resultsIndexes.push({ index: index, name: "speechToText", type: "text" })
                    mySbMsg.type = "text"
                    mySbMsg.index = index + 1
                    mySbMsg.data = result
                }
            }

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

}
