import { BpaConfiguration, BpaStage, BpaServiceObject } from "./types"
import MessageQueue from "../services/messageQueue"
import { DB } from "../services/db"
const _ = require('lodash')

export class BpaEngine {

    constructor() {

    }

    public processAsync = async (serviceObject: BpaServiceObject, stageIndex: number, config: BpaConfiguration, mq : MessageQueue, db : DB): Promise<BpaServiceObject> => {

        return this._process(serviceObject, config, stageIndex, mq, db)

    }

    public processFile = async (fileBuffer: Buffer, fileName: string, config: BpaConfiguration, mq : MessageQueue, db : DB): Promise<BpaServiceObject> => {

        let currentInput: BpaServiceObject = {
            label: "first",
            pipeline: config.name,
            type: this._getFileType(fileName),
            filename: fileName,
            data: fileBuffer,
            bpaId: "1",
            aggregatedResults: { "buffer": fileBuffer },
            resultsIndexes: [{ index: 0, name: "buffer", type: this._getFileType(fileName) }]
        }

        console.log(this._getFileType(fileName))

        let stageIndex = 1
        return this._process(currentInput, config, stageIndex, mq, db)

    }

    private _process = async (currentInput: BpaServiceObject, config: BpaConfiguration, stageIndex: number, mq : MessageQueue, db: DB) => {
        for (let i = stageIndex; i < config.stages.length + 1; i++) {
            const stage = config.stages[i - 1]
            //for (const stage of config.stages) {
            console.log(`stage : ${stage.service.name}`)
            console.log(`currentInput : ${JSON.stringify(currentInput.type)}`)
            console.log('validating...')
            if (this._validateInput(currentInput.type, stage)) {
                console.log('validation passed')
                currentInput.serviceSpecificConfig = stage.service.serviceSpecificConfig
                const currentOutput: BpaServiceObject = await stage.service.process(currentInput, stageIndex)
                console.log('exiting stage')
                currentInput = _.cloneDeep(currentOutput)
                if (currentInput.type === 'async transaction') {
                    delete currentInput.aggregatedResults.buffer
                    const dbout = await db.create(currentInput)

                    delete currentInput.data

                    currentInput.dbId = dbout.id
                    currentInput.aggregatedResults = dbout.id
                    currentInput.data = dbout.id

                    currentInput.stages = config.stages
                    currentInput.index = stageIndex

                    
                    await mq.sendMessage(currentInput)
                    break
                }
            }
            else {
                throw new Error(`invalid input type ${JSON.stringify(currentInput.type)} for stage ${stage.service.name}`)
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