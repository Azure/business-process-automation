
import { Tool } from "langchain/tools";
import { CogSearchRetrievalQAChain } from "../chains/cogSearchRetrievalQA";
import { BufferWindowMemory, ChatMessageHistory } from "langchain/memory";
import { ChainValues } from "langchain/schema";

export class CogSearchTool extends Tool {

    private _chainParameters : any
    private _history : ChatMessageHistory
    private _memorySize : number
    private _results : ChainValues[]

    constructor(parameters : any){
        super()
        this._chainParameters = parameters.chainParameters
        this.name = parameters.name
        this.description = parameters.description
        this._memorySize = parameters.memorySize
        this._results = []
        this._history = parameters.history
        
        
    }

    public name : string

    public description : string

    public getResults = () : ChainValues[] => {
        return this._results
    }

    public _call = async (arg : string) : Promise<string> => {
        const chain = new CogSearchRetrievalQAChain(this._chainParameters)
        let outputKey = "text"
        if(this?._chainParameters?.type === "refine"){
            outputKey = "output_text"
        }
        const memory = new BufferWindowMemory({k : this._memorySize, memoryKey : "chat_history", outputKey : outputKey, chatHistory : this._history}) 
        const values = await chain.run(arg, memory)
        this._results.push(values)
        return values.answer
    }
}