import { ChainValues, LLMResult } from "langchain/schema"
import { CogSearchRetriever } from "../retrievers/cogsearch"
import { OpenAIBaseInput } from "langchain/dist/types/openai-types"
import { ConversationalRetrievalQAChain, MapReduceQAChainParams, QAChainParams, RefineQAChainParams, StuffQAChainParams } from "langchain/chains";
import { BufferWindowMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BaseRetriever } from "langchain/schema/retriever";
import { BaseCallbackHandler } from "langchain/callbacks";
import { Serialized } from "langchain/dist/load/serializable";
import { PromptTemplate } from "langchain";

const getPrompt = (prompt) => {
    return (prompt && prompt.length > 0) ? PromptTemplate.fromTemplate(prompt) : null
}

export class CogSearchRetrievalQAChain {
    private _parameters: any
    private _callback: BaseCallbackHandler
    constructor(parameters: any) {
        this._parameters = parameters
    }

    public run = async (query: string, memory: BufferWindowMemory): Promise<ChainValues> => {

        const thoughts = []
        const retriever: BaseRetriever = new CogSearchRetriever(this._parameters.retriever)
        const llmConfig: OpenAIBaseInput = this._parameters.llmConfig
        llmConfig["callbacks"] = [
            {
                handleLLMStart: async (llm: Serialized, prompts: string[]) => {
                    console.log(JSON.stringify(llm, null, 2));
                    console.log(JSON.stringify(prompts, null, 2));
                    thoughts.push({"start": prompts[0]})
                },
                handleLLMEnd: async (output: LLMResult) => {
                    console.log(JSON.stringify(output, null, 2));
                    thoughts.push({"end": output.generations[0][0].text})
                },
                handleLLMError: async (err: Error) => {
                    console.error(err);
                },
            },
        ]
        const llm = new ChatOpenAI(llmConfig)
        let qaChainParams : QAChainParams
        switch (this._parameters.type) {
            case "stuff":
                const stuffParams: StuffQAChainParams = {
                    verbose: true,
                    prompt: getPrompt(this._parameters.stuffPrompt)
                }
                qaChainParams = stuffParams
                qaChainParams.type = this._parameters.type
                break;
            case "refine":
                const refineParams: RefineQAChainParams = {
                    verbose: true,
                    refinePrompt : getPrompt(this._parameters.refinePrompt),
                    questionPrompt : getPrompt(this._parameters.refineQuestionPrompt)
                }
                qaChainParams = refineParams
                qaChainParams.type = this._parameters.type
                break;
            case "map_reduce":
                const mapReduceParams: MapReduceQAChainParams = {
                    returnIntermediateSteps: true,
                    verbose: true,
                    combineMapPrompt: getPrompt(this._parameters.mrCombineMapPrompt),
                    combinePrompt: getPrompt(this._parameters.mrCombinePrompt),
                }
                qaChainParams = mapReduceParams
                qaChainParams.type = this._parameters.type
                break;
        }


        const retrievalChain = ConversationalRetrievalQAChain.fromLLM(
            llm,
            retriever,
            {
                memory: memory,
                qaChainOptions: qaChainParams,
                returnSourceDocuments: true,
                questionGeneratorChainOptions: {
                    llm,
                    template: this._parameters.questionGenerationPrompt && this._parameters.questionGenerationPrompt.length > 0 ? this._parameters.questionGenerationPrompt : null
                }

            }
        );
        retrievalChain.inputKey = "question"

        let out = await retrievalChain.call({ question: query })
        out.thoughts = thoughts

        return out
    }
}