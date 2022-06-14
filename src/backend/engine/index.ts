import { BpaConfiguration, BpaStage, BpaServiceObject } from "./types"
const _ = require('lodash')

export class BpaEngine {

    constructor() {

    }

    public processFile = async (fileBuffer: Buffer, fileName: string, config: BpaConfiguration) : Promise<BpaServiceObject> => {

        let currentInput: BpaServiceObject = {
            label: "first",
            type: this._getFileType(fileName),
            projectName: fileName,
            data: fileBuffer,
            bpaId: "1",
            aggregatedResults : { "buffer" : fileBuffer },
            resultsIndexes : [{index : 0, name : "buffer", type : this._getFileType(fileName)}]
        }

        console.log(this._getFileType(fileName))

        let stageIndex = 1
        for (const stage of config.stages) {
            console.log(`stage : ${stage.service.name}`)
            console.log(`currentInput : ${JSON.stringify(currentInput.type)}`)
            console.log('validating...')
            if (this._validateInput(currentInput.type, stage)) {
                console.log('validation passed')
                currentInput.serviceSpecificConfig = stage.service.serviceSpecificConfig
                const currentOutput: BpaServiceObject = await stage.service.process(currentInput, stageIndex)
                console.log('exiting stage')
                currentInput = _.cloneDeep(currentOutput)
            }
            else {
                throw new Error(`invalid input type ${currentInput} for stage ${stage.service.name}`)
            }
            stageIndex++;
        }

        delete currentInput.resultsIndexes
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