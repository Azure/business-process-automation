import { BpaConfiguration, BpaStage, BpaServiceObject } from "./types"
const _ = require('lodash')

export class BpaEngine {

    constructor() {

    }

    public processAsync = async (serviceObject : BpaServiceObject, stageIndex : number, config: BpaConfiguration) : Promise<BpaServiceObject> => {

        return this._process(serviceObject, config, stageIndex)

    }

    public processFile = async (fileBuffer: Buffer, fileName: string, config: BpaConfiguration) : Promise<BpaServiceObject> => {

        let currentInput: BpaServiceObject = {
            label: "first",
            pipeline : config.name,
            type: this._getFileType(fileName),
            filename: fileName,
            data: fileBuffer,
            bpaId: "1",
            aggregatedResults : { "buffer" : fileBuffer },
            resultsIndexes : [{index : 0, name : "buffer", type : this._getFileType(fileName)}]
        }

        console.log(this._getFileType(fileName))

        let stageIndex = 1
        return this._process(currentInput, config, stageIndex)
<<<<<<< HEAD
        // for (const stage of config.stages) {
        //     console.log(`stage : ${stage.service.name}`)
        //     console.log(`currentInput : ${JSON.stringify(currentInput.type)}`)
        //     console.log('validating...')
        //     if (this._validateInput(currentInput.type, stage)) {
        //         console.log('validation passed')
        //         currentInput.serviceSpecificConfig = stage.service.serviceSpecificConfig
        //         const currentOutput: BpaServiceObject = await stage.service.process(currentInput, stageIndex)
        //         console.log('exiting stage')
        //         currentInput = _.cloneDeep(currentOutput)
        //         if(currentInput.type === 'async transaction'){
        //             currentInput.stages = config.stages
        //             break;
        //         }
        //     }
        //     else {
        //         throw new Error(`invalid input type ${currentInput} for stage ${stage.service.name}`)
        //     }
        //     stageIndex++;
        // }

        // delete currentInput.resultsIndexes
        // delete currentInput.data
        // delete currentInput.aggregatedResults.buffer

        // return currentInput
    }

    private _process = async (currentInput : BpaServiceObject, config : BpaConfiguration, stageIndex : number) => {
        for (const stage of config.stages) {
=======
    }

    private _process = async (currentInput : BpaServiceObject, config : BpaConfiguration, stageIndex : number) => {
        for(let i=stageIndex;i<config.stages.length + 1;i++){
            const stage = config.stages[i-1]
        //for (const stage of config.stages) {
>>>>>>> c55b29acb59884f7b1b55ca752d0400469f81439
            console.log(`stage : ${stage.service.name}`)
            console.log(`currentInput : ${JSON.stringify(currentInput.type)}`)
            console.log('validating...')
            if (this._validateInput(currentInput.type, stage)) {
                console.log('validation passed')
                currentInput.serviceSpecificConfig = stage.service.serviceSpecificConfig
                const currentOutput: BpaServiceObject = await stage.service.process(currentInput, stageIndex)
                console.log('exiting stage')
                currentInput = _.cloneDeep(currentOutput)
                if(currentInput.type === 'async transaction'){
                    currentInput.stages = config.stages
<<<<<<< HEAD
=======
                    currentInput.index = stageIndex
                    break
>>>>>>> c55b29acb59884f7b1b55ca752d0400469f81439
                }
            }
            else {
                throw new Error(`invalid input type ${currentInput} for stage ${stage.service.name}`)
            }
            stageIndex++;
        }

        delete currentInput.data
        delete currentInput.aggregatedResults.buffer

        return currentInput

    }

    private _validateInput = (input: string, stage: BpaStage): boolean => {
        if (stage.service.name == 'view') {
            return true
        }
        if (stage.service.name == 'changeOutput') {
            return true
        }
        if (stage.service.inputTypes.includes(input)) {
            return true
        }
        return false
    }

    private _getFileType = (fileName: string): string => {
        const fileParts: string[] = fileName.split('.')
        return fileParts[fileParts.length - 1]
    }

}