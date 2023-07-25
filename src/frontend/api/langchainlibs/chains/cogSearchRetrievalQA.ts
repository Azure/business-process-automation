import { ChainValues } from "langchain/schema"
import { CogSearchRetriever } from "../retrievers/cogsearch"
import { OpenAIBaseInput } from "langchain/dist/types/openai-types"
import { ConversationalRetrievalQAChain, QAChainParams } from "langchain/chains";
import { BufferWindowMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BaseRetriever } from "langchain/dist/schema/retriever";

export class CogSearchRetrievalQAChain {
    private _parameters: any
    constructor(parameters: any) {
        this._parameters = parameters
    }

    public run = async (query: string, memory: BufferWindowMemory): Promise<ChainValues> => {

        const retriever: BaseRetriever = new CogSearchRetriever(this._parameters.retriever)
        const llmConfig: OpenAIBaseInput = this._parameters.llmConfig
        const llm = new ChatOpenAI(llmConfig)

        const qaChainParams: QAChainParams = {
            type: this._parameters.type,
            verbose: true,
            returnIntermediateSteps: true
        }

        const retrievalChain = ConversationalRetrievalQAChain.fromLLM(
            llm,
            retriever,
            {
                memory: memory,
                qaChainOptions: qaChainParams,
                returnSourceDocuments: true,
                questionGeneratorChainOptions: {
                    llm: llm
                }

            }
        );

        const out = await retrievalChain.call({ question: query })
        return out
        //return { answer: out[memory.outputKey], sourceDocuments: out.sourceDocuments, chatHistory: retrievalChain.memory["chatHistory"] }
    }
}