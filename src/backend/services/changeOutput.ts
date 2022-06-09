import { BpaServiceObject, ResultsIndex } from "../engine/types";

export class ChangeOutput {

    constructor() {

    }

    private _getResultsIndex = (input : BpaServiceObject, index : number) : ResultsIndex => {
        for(const i of input.resultsIndexes){
            if(i.index === index){
                return i
            }
        }

        return null
    }

    
    public process = async (input: BpaServiceObject, index : number): Promise<BpaServiceObject> => {

        const resultsIndex : ResultsIndex = this._getResultsIndex(input, index)
        
        return {
            data: input.aggregatedResults[resultsIndex.name],
            type: "changeOutput",
            label: "changeOutput",
            projectName: input.projectName,
            bpaId: input.bpaId,
            aggregatedResults: input.aggregatedResults,
            resultsIndexes : input.resultsIndexes
        }

    }
}