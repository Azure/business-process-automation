import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { BpaServiceObject } from '../engine/types'


export class Speech {

    private _client : sdk.SpeechConfig

    constructor(subscriptionKey : string, region : string){
        this._client  = sdk.SpeechConfig.fromSubscription(subscriptionKey, region)
        this._client.setProfanity(sdk.ProfanityOption.Raw)
        
    }

    public process = (input : BpaServiceObject, index : number) : Promise<BpaServiceObject> => {

        console.log("kicking off stt .......")
        return new Promise<BpaServiceObject>((resolve, reject)=> {
            try{

                if(input?.serviceSpecificConfig?.to){
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
                    input.resultsIndexes.push({index : index, name : "speechToText", type : "text"})
                    resolve( {
                        data : out,
                        label : "speechToText",
                        bpaId : input.bpaId,
                        type : 'text',
                        filename: input.filename,
                        pipeline: input.pipeline,
                        aggregatedResults : results,
                        resultsIndexes : input.resultsIndexes
                    })
                };

                
                speechRecognizer.startContinuousRecognitionAsync();
            } catch(err){
                console.log(err)
                reject(new Error(err.message))
            }
        })
    }

    public getPricing = (hours : number) : number => {
        const thousand = 1000
        if(hours < 2*thousand){
            return (hours * 1)
        } else if (hours > (2*thousand) && hours < (10*thousand)){
            return (hours * .80)
        }else if (hours > (10*thousand) && hours < (50*thousand)){
            return (hours * .65)
        }else if (hours > (50*thousand) ){
            return (hours * .50)
        }
        throw new Error("error in ContentModerator getPricing")
    }
}
