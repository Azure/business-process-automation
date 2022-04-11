const sdk = require("microsoft-cognitiveservices-speech-sdk");
import { BpaServiceObject } from '../engine/types'


export class Speech {

    private _client

    constructor(subscriptionKey : string, region : string){
        this._client = sdk.SpeechConfig.fromSubscription(subscriptionKey, region)
    }

    public process = (input : BpaServiceObject) : Promise<BpaServiceObject> => {

        return new Promise<BpaServiceObject>((resolve, reject)=> {
            try{
                let audioConfig = sdk.AudioConfig.fromWavFileInput(input.data);
                let speechRecognizer = new sdk.SpeechRecognizer(this._client, audioConfig);
            
                let out = ""
                speechRecognizer.recognizeOnceAsync(result => {
                    switch (result.reason) {
                        case sdk.ResultReason.RecognizedSpeech:
                            console.log(`RECOGNIZED: Text=${result.text}`);
                            out += result.text + " "
                            break;
                        case sdk.ResultReason.NoMatch:
                            console.log("NOMATCH: Speech could not be recognized.");
                            break;
                        case sdk.ResultReason.Canceled:
                            console.log('cancelled')
                            break;
                    }    
                    speechRecognizer.close();
                    resolve( {
                        data : out,
                        label : input.label,
                        bpaId : input.bpaId,
                        type : 'text',
                        projectName : input.projectName
                    })
                });
            } catch(err){
                console.log(err)
                reject(err)
            }
        })
    }
}