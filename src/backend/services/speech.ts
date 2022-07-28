import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { BpaServiceObject } from '../engine/types'
import { BlobServiceClient, ContainerClient, BlockBlobClient, ContainerGenerateSasUrlOptions, ContainerSASPermissions } from "@azure/storage-blob"

import axios, { AxiosRequestConfig } from 'axios'
import { CosmosDB } from "./cosmosdb";


export class Speech {

    private _client: sdk.SpeechConfig
    private _blobServiceClient: BlobServiceClient
    private _blobContainerClient: ContainerClient
    private _cosmosDb: CosmosDB

    constructor(subscriptionKey: string, region: string, connectionString: string, containerName: string, cosmosConnectionString : string, cosmosDb: string, cosmosContainer : string) {
        this._client = sdk.SpeechConfig.fromSubscription(subscriptionKey, region)
        this._client.setProfanity(sdk.ProfanityOption.Raw)
        this._blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        this._blobContainerClient = this._blobServiceClient.getContainerClient(containerName);
        this._cosmosDb = new CosmosDB(cosmosConnectionString, cosmosDb, cosmosContainer)
    }

    public processBatch = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        try {
            console.log("kicking off stt batch.......")

            const options: ContainerGenerateSasUrlOptions = {
                permissions: ContainerSASPermissions.parse("r"),
                expiresOn: new Date(new Date().valueOf() + 86400),
            }
            const filename = input.filename.replace("documents/", "")
            const blobClient: BlockBlobClient = this._blobContainerClient.getBlockBlobClient(filename)
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
            const axiosParams : AxiosRequestConfig = {
                headers : {
                        "Content-Type" : "application/json",
                        "Ocp-Apim-Subscription-Key" : process.env.SPEECH_SUB_KEY
                    }
            }
            const axiosResp = await axios.post(process.env.SPEECH_SUB_ENDPOINT + 'speechtotext/v3.0/transcriptions', payload, axiosParams)

            let result = {}
            let status = "initializing"
            do{
                const axiosGetResp = await axios.get(axiosResp.headers.location, axiosParams)
                if(axiosGetResp?.data?.status){
                    status = axiosGetResp.data.status
                } else{
                    throw new Error(`failed in Speech accessing ${axiosResp.headers.location}`)
                }
                if(status === 'Failed'){
                    throw new Error('batch transcription failed')
                }
                if(status === 'succeeded' && axiosGetResp?.data?.links?.files){
                    result = axiosGetResp.data.links.files
                }
            } while(status !== 'Succeeded')

            return {
                data : result,
                type : "async transaction",
                label : input.label,
                filename : input.filename,
                pipeline : input.pipeline,
                bpaId : input.bpaId,
                aggregatedResults : input.aggregatedResults,
                resultsIndexes : input.resultsIndexes
            }

            // this._cosmosDb.create({
            //     data : result,
            //     type : "async transaction",
            //     label : input.label,
            //     filename : input.filename,
            //     pipeline : input.pipeline,
            //     bpaId : input.bpaId,
            //     aggregatedResults : input.aggregatedResults,
            //     resultsIndexes : input.resultsIndexes
            // })

            //     const axiosGetResp = await axios.get(axiosResp.headers.location, axiosParams)
            //     if(axiosGetResp.data.status === 'Succeeded'){
            //         const axiosGetResp2 = await axios.get(axiosGetResp.data.links.files, axiosParams)
            //         for(const value of axiosGetResp2.data.values){
            //             if(value.kind === 'Transcription'){
            //                 const axiosGetResp3 = await axios.get(value.links.contentUrl, axiosParams)
            //                 let result = ""
            //                 for(const combined of axiosGetResp3.data.combinedRecognizedPhrases)
            //                 {
            //                     result += " " + combined.display
            //                 }
            //                 break
            //                 console.log("here")
            //             }
            //         }
            //         console.log("here")
            //     }
            //     console.log("here")
            // }

            // //const sasUrl = await this._blobContainerClient.generateSasUrl(options)
            // console.log(result)

        } catch (err) {
            console.log(err)
        }

        //return input
    }

    public process = (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        console.log("kicking off stt .......")
        return new Promise<BpaServiceObject>((resolve, reject) => {
            try {

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


                    //speechRecognizer.stopContinuousRecognitionAsync();
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
            } catch (err) {
                console.log(err)
                reject(new Error(err.message))
            }
        })
    }


}
