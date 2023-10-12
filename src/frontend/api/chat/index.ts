import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios"

import { BufferWindowMemory, ChatMessageHistory } from "langchain/memory";
import { ChainValues } from "langchain/schema";
import { CogSearchRetrievalQAChain } from "../langchainlibs/chains/cogSearchRetrievalQA";
import { CogSearchTool } from "../langchainlibs/tools/cogsearch";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { Tool } from "langchain/tools"

process.env.OPENAI_API_TYPE = "azure"
process.env.AZURE_OPENAI_API_KEY = process.env.OPENAI_KEY
process.env.AZURE_OPENAI_API_INSTANCE_NAME = `oai${process.env.COSMOS_DB_CONTAINER}`
process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME = process.env.OPENAI_DEPLOYMENT_TEXT
// process.env.AZURE_OPENAI_API_COMPLETIONS_DEPLOYMENT_NAME="gpt-35-turbo"
// process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME="gpt-35-turbo"
process.env.AZURE_OPENAI_API_VERSION = "2023-03-15-preview"
process.env.AZURE_OPENAI_API_BASE = process.env.OPENAI_ENDPOINT



const runChain = async (pipeline, history): Promise<ChainValues> => {
  const chain = new CogSearchRetrievalQAChain(pipeline.chainParameters)
  let outputKey: string
  if (pipeline.chainParameters.type === "refine") {
    outputKey = "output_text"
  } else {
    outputKey = "text"
  }

  const memory: BufferWindowMemory = new BufferWindowMemory({ k: pipeline.memorySize, memoryKey: "chat_history", outputKey: outputKey})
  const query = history[history.length - 1].user
  const out = await chain.run(query, memory)
  return out
}

const runAgent = async (pipeline, history): Promise<ChainValues> => {
  const tools: Tool[] = []
  for (const t of pipeline.parameters.tools) {
    t.history = convertToLangChainMessage(history)
    const tool = new CogSearchTool(t)
    tools.push(tool)
  }
  let executor
  switch (pipeline.subType) {
    case "zero-shot-react-description":
    case "chat-zero-shot-react-description":
    case "openai-functions":
      executor = await initializeAgentExecutorWithOptions(
        tools,
        new ChatOpenAI(pipeline.parameters.llmConfig),
        { agentType: pipeline.subType, verbose: true }
      );
      break;
    case "plan-and-execute":
      executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
        llm: new ChatOpenAI(pipeline.parameters.llmConfig),
        tools,
      });
      break;

  }
  const query = history[history.length - 1].user
  const controller = new AbortController();

  // Call `controller.abort()` somewhere to cancel the request.
  setTimeout(() => {
    controller.abort();
  }, 60000);
  const result = await executor.call({
    input: query, signal: controller.signal
  });

  return result
}

const convertToMessage = (history) => {
  const messages = []
  for (const h of history) {
    if (h?.user) {
      messages.push({ role: "user", content: h.user })
    } if (h?.assistant) {
      messages.push({ role: "assistant", content: h.assistant })
    } if (h?.tool) {
      messages.push({ role: "tool", content: h.tool })
    }
  }

  return messages
}

const convertToLangChainMessage = (history) => {
  const messages = new ChatMessageHistory();
  //messages.addAIChatMessage(aiMessage)
  for (let i = 0; i < history.length - 1; i++) {  //ignore most recent user utterance
    //for (const h of history) {
    const h = history[i]
    if (h?.user) {
      messages.addUserMessage(h.user)
    } if (h?.assistant) {
      messages.addAIChatMessage(h.assistant)
    } if (h?.tool) {
      messages.addMessage(h.tool)
    }
  }

  return messages
}

const defaultChat = async (context, req) => {
  const url = `${process.env.OPENAI_ENDPOINT}openai/deployments/${process.env.OPENAI_DEPLOYMENT_TEXT}/extensions/chat/completions?api-version=2023-06-01-preview`
  const headers = {
    "Content-Type": "application/json",
    "api-key": process.env.OPENAI_KEY,
    "chatgpt_url": `${process.env.OPENAI_ENDPOINT}openai/deployments/${process.env.OPENAI_DEPLOYMENT_TEXT}/chat/completions?api-version=2023-03-15-preview`,
    "chatgpt_key": process.env.OPENAI_KEY,
    "accept": "*/*"

  }
  if(req.body.index?.searchableFields ){
    req.body.index.searchableFields = req.body.index.searchableFields.filter(sf => {
      if(!sf.toLowerCase().includes('vector') && !sf.toLowerCase().includes('/')){
        return sf
      }
    })
  }
  const body = {
    "dataSources": [
      {
        "type": "AzureCognitiveSearch",
        "parameters": {
          "endpoint": process.env.COGSEARCH_URL,
          "key": process.env.COGSEARCH_APIKEY,
          "indexName": req.body.index.name,
          "semanticConfiguration": req.body.index?.semanticConfigurations && req.body.index?.semanticConfigurations.length > 0 ? req.body.index?.semanticConfigurations[0].name : null,
          "queryType": req.body.index?.semanticConfigurations && req.body.index?.semanticConfigurations.length > 0 ? "semantic" : "simple",
          "fieldsMapping": {
            "contentFieldsSeparator": "\n",
            "contentFields": req.body.index.searchableFields,
            "filepathField": "filename",
            "titleField": "filename",
            "urlField": "filename"
          },
          "inScope": true,
          "roleInformation": "You are an AI assistant that helps people find information."
        }
      }
    ],
    "messages": convertToMessage(req.body.history),
    "deployment": process.env.OPENAI_DEPLOYMENT_TEXT,
    "temperature": 0,
    "top_p": 1,
    "max_tokens": 800,
    "stop": null,
    "stream": false
  }
  try {
    const { data } = await axios.post(url, body, { headers: headers })

    let answer = ''
    let citations = []
    for (const c of data.choices) {
      for (const m of c.messages) {
        if (m.role === 'tool') {
          const contentObj = JSON.parse(m.content)
          citations = contentObj.citations
        } else if (m.role === 'assistant') {
          answer = m.content
        }
      }
    }

    context.res = {
      body: { "data_points": citations, "answer": answer, "thoughts": JSON.stringify(data.choices) }
    }

  } catch (err) {
    context.res = {
      body: JSON.stringify(err)
    }
  }

}

const run = async (pipeline: any, history: any): Promise<ChainValues> => {

  if (pipeline.type === "chain") {
    return runChain(pipeline, history)
  } else if (pipeline.type === 'agent') {
    return runAgent(pipeline, history)
  }

  return null
}

const toHtml = (thoughts) => {
  let out = "<div>"
  for(const t of thoughts){
    out += `<div>${Object.keys(t)[0]} : ${(Object.values(t)[0] as string).replace('\n','<br>')}</div><br>`
  }
  out += "</div>"
  return out
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

  try {
    if (req.body.pipeline.name === 'default') {
      return defaultChat(context, req)
    } else {
      const v = await run(req.body.pipeline, req.body.history)
      let answer = ""
      if (v?.output) {
        answer = v.output
      } else if (v?.text) {
        answer = v.text
      } else if (v?.output_text) {
        answer = v.output_text
      }

      let data_points = []
      if (v?.sourceDocuments) {
        for (const d of v.sourceDocuments) {
          data_points.push({
            title: d.metadata.filename,
            content: d.pageContent
          })
        }
      }

      context.res = {
        body: { "data_points": data_points, "answer": answer, "thoughts": toHtml(v?.thoughts) }
      }
    }
  } catch (err) {
    context.res = {
      body: { "data_points": [], "answer": `Something went wrong. ${err.message}`, "thoughts": "" }
    }
  }

  //defaultChat(context, req)
};


export default httpTrigger;
