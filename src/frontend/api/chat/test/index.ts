//import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios, { AxiosRequestConfig } from "axios"

import { BufferWindowMemory, ChatMessageHistory } from "langchain/memory";
import { ChainValues } from "langchain/schema";
import { CogSearchRetrievalQAChain } from "../../langchainlibs/chains/cogSearchRetrievalQA";
import { CogSearchTool } from "../../langchainlibs/tools/cogsearch";
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { Tool } from "langchain/tools"

import { payload } from "./chainpayload"

import * as data from '../../local.settings.json'
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { LLMChain, PromptTemplate } from "langchain";
import * as fs from 'fs'

process.env.OPENAI_API_TYPE = "azure"
process.env.AZURE_OPENAI_API_KEY = data.Values.OPENAI_KEY
process.env.AZURE_OPENAI_API_INSTANCE_NAME = `oai${data.Values.COSMOS_DB_CONTAINER}`
process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME = data.Values.OPENAI_DEPLOYMENT_TEXT
// process.env.AZURE_OPENAI_API_COMPLETIONS_DEPLOYMENT_NAME="gpt-35-turbo"
// process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME="gpt-35-turbo"
process.env.AZURE_OPENAI_API_VERSION = "2023-03-15-preview"
process.env.AZURE_OPENAI_API_BASE = data.Values.OPENAI_ENDPOINT
//process.env.MAPS_API_KEY = data.Values.MAPS_API_KEY
process.env.COGSEARCH_URL = data.Values.COGSEARCH_URL
process.env.COGSEARCH_APIKEY = data.Values.COGSEARCH_APIKEY

const runChain = async (pipeline, history, prev): Promise<ChainValues> => {
  let chain = new CogSearchRetrievalQAChain(pipeline.chainParameters)

  let outputKey: string
  if (pipeline.chainParameters.type === "refine") {
    outputKey = "output_text"
  } else {
    outputKey = "text"
  }

  const memory: BufferWindowMemory = new BufferWindowMemory({ k: pipeline.memorySize, memoryKey: "chat_history", outputKey: outputKey, chatHistory: convertToLangChainMessage(history) })
  const query = history[history.length - 1].user
  const out = await chain.run(query, memory)
  return out
}

const runAgent = async (pipeline, history): Promise<ChainValues> => {
  //pipeline.history = convertToLangChainMessage(history)
  //pipeline.parameters.tools[0].history = convertToLangChainMessage(history)
  //const tool = new LocationTool(pipeline.parameters.tools[0])
  const tools: Tool[] = []
  const memory: BufferWindowMemory = new BufferWindowMemory({ k: pipeline.memorySize, memoryKey: "chat_history", chatHistory: convertToLangChainMessage(history) })
  for (const t of pipeline.parameters.tools) {
    t.memory = memory
    let tool = new CogSearchTool(t)
    tools.push(tool)
  }
  // const agent = new HotelAgent(pipeline)
  // const executor = new AgentExecutor({
  //   agent: agent,
  //   tools: tools,
  //   maxIterations: 3
  // });




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

  setTimeout(() => {
    controller.abort();
  }, 30000);
  const result = await executor.call({
    input: query, signal: controller.signal, memory: memory

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

const defaultChat = async (index, history) => {
  const url = `${process.env.OPENAI_ENDPOINT}openai/deployments/${process.env.OPENAI_DEPLOYMENT_TEXT}/extensions/chat/completions?api-version=2023-06-01-preview`
  const headers = {
    "Content-Type": "application/json",
    "api-key": process.env.OPENAI_KEY,
    "chatgpt_url": `${process.env.OPENAI_ENDPOINT}openai/deployments/${process.env.OPENAI_DEPLOYMENT_TEXT}/chat/completions?api-version=2023-03-15-preview`,
    "chatgpt_key": process.env.OPENAI_KEY,
    "accept": "*/*"

  }
  const body = {
    "dataSources": [
      {
        "type": "AzureCognitiveSearch",
        "parameters": {
          "endpoint": process.env.COGSEARCH_URL,
          "key": process.env.COGSEARCH_APIKEY,
          "indexName": index.name,
          "semanticConfiguration": "default",
          "queryType": "semantic",
          "fieldsMapping": {
            "contentFieldsSeparator": "\n",
            "contentFields": index.searchableFields,
            "filepathField": "filename",
            "titleField": "filename",
            "urlField": "filename"
          },
          "inScope": true,
          "roleInformation": "You are an AI assistant that helps people find information."
        }
      }
    ],
    "messages": convertToMessage(history),
    "deployment": process.env.OPENAI_DEPLOYMENT_TEXT,
    "temperature": 0,
    "top_p": 0,
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

    return { "data_points": citations, "answer": answer, "thoughts": JSON.stringify(data.choices) }

    // context.res = {
    //   body: { "data_points": citations, "answer": answer, "thoughts": JSON.stringify(data.choices) }
    // }

  } catch (err) {
    console.log(err)
    // context.res = {
    //   body: JSON.stringify(err)
    // }
  }

}

const run = async (pipeline: any, history: any, prev): Promise<ChainValues> => {

  if (pipeline.type === "chain") {
    return runChain(pipeline, history, prev)
  } else if (pipeline.type === 'agent') {
    return runAgent(pipeline, history)
  }

  return null
}

//const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
const go = async (payload, prev) => {
  try {
    if (payload.pipeline.name === 'default') {
      //return defaultChat(context, req)
      return null
    } else {
      const v = await run(payload.pipeline, payload.history, prev)
      let answer = ""
      if (v?.output) {
        answer = v.output
      } else if (v?.text) {
        answer = v.text
      } else if (v?.output_text) {
        answer = v.output_text
      }

      //let data_points = []
      // if (v?.sourceDocuments) {
      //   for (const d of v.sourceDocuments) {
      //     data_points.push({
      //       title: d.metadata.filename,
      //       content: d.pageContent
      //     })
      //   }
      // }

      return { "data_points": v.sourceDocuments, "answer": answer, "thoughts": "" }
      // context.res = {
      //   body: { "data_points": data_points, "answer": answer, "thoughts": "" }
      // }
    }
  } catch (err) {
    return { "data_points": [], "answer": `Something went wrong. ${err.message}`, "thoughts": "" }
    // context.res = {
    //   body: { "data_points": [], "answer": `Something went wrong. ${err.message}`, "thoughts": "" }
    // }
  }

  //defaultChat(context, req)
}

const llmData = async (data, highLevelDescription, currentDescription) => {
  if (!currentDescription) {
    currentDescription = { text: 'None' }
  }
  const model = new ChatOpenAI({ temperature: 0, stop: ['<stop>'] });
  const prompt = PromptTemplate.fromTemplate(
    `
    The following are data points in a larger database.  Given the name of the field and the contents, create a high level description of the data.  
    The Current Description is the description provided from previous data points.  The intention is to further refine the description by refining the Current Description with a new Description.  The refined Description should become less specific, but generally relevant to the data.
    High Level Data Description : Car Owner's Manual
    Data:
    Title[searchable=true, filterable=true] : How to drive your car
    Title[searchable=true, filterable=true] : Entertainment system
    Title[searchable=true, filterable=true] : Tire Pressures

    Current Description : Sections of the car's owners manual that describes different lights on the dashboard.
    Description :  Titles of different sections or chapters of a car owner's manual.<stop>

    The following are data points in a larger database.  Given the name of the field and the contents, create a high level description of the data.  
    The Current Description is the description provided from previous data points.  The intention is to further refine the description by refining the Current Description with a new Description.  The refined Description should become less specific, but generally relevant to the data.
    High level data description : {high_level}
    Data : {data}
    Current Description: {currentDescription}
    Description : `
  );
  //console.log(await prompt.format({ high_level: highLevelDescription, data: JSON.stringify(data), currentDescription : currentDescription }))
  const chainA = new LLMChain({ llm: model, prompt });
  const resA = await chainA.call({ high_level: highLevelDescription, data: JSON.stringify(data), currentDescription: currentDescription.text });
  return resA
}

const getFacetableFields = (fields: any, name: string, result: string[], collections: string[]) => {
  for (const field of fields) {
    if (field.facetable === true) {
      if (name) {
        result.push(`${name}/${field.name}`)
      } else {
        result.push(`${field.name}`)
      }
    }
    if (field.type.includes('Collection(')) {
      collections.push(field.name)
    }
    if (field?.fields) {
      if (name) {
        const _result = getFacetableFields(field.fields, `${name}/${field.name}`, result, collections)
        result = _result.result
      } else {
        const _result = getFacetableFields(field.fields, field.name, result, collections)
        result = _result.result
      }

    }
  }

  return { result: result, collections: collections }
}

const getSearchableFields = (fields: any, name: string, result: string[], collections: string[]) => {
  for (const field of fields) {
    if (field.searchable === true) {
      if (name) {
        result.push(`${name}/${field.name}`)
      } else {
        result.push(`${field.name}`)
      }
    }
    if (field.type.includes('Collection(')) {
      collections.push(field.name)
    }
    if (field?.fields) {
      if (name) {
        const _result = getSearchableFields(field.fields, `${name}/${field.name}`, result, collections)
        result = _result.result
      } else {
        const _result = getSearchableFields(field.fields, field.name, result, collections)
        result = _result.result
      }

    }
  }

  return { result: result, collections: collections }
}

const getFacetSearchConfig = (_facets) => {
  const result = []
  for (const _facet of _facets) {
    if (_facet !== '') {
      result.push(`${_facet},count:1000`)
    }
  }
  return result
}

const getFacetsString = (facets) => {
  let result = ""
  let index = 0
  for (const facet of facets) {
    if (index === 0) {
      result = facet
    } else {
      result += `, ${facet}`
    }
    index++
  }
  return result
}

const search = async (query: string, indexConfig, numDocs): Promise<any[]> => {
  try {

    const headers: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.COGSEARCH_APIKEY
      }
    }
    let body: any = {
      search: query,
      count: true,
      facets: getFacetSearchConfig(getFacetsString(getFacetableFields(indexConfig.fields, null, [], []).result).split(',')),
      //facets: getFacetableFields(indexConfig.fields, null, [], []),
      filter: "",
      queryType: "semantic",
      skip: 0,
      top: numDocs,
      semanticConfiguration: "default",
      answers: "extractive|count-3",
      captions: "extractive|highlight-true",
      queryLanguage: "en"
    }
    if (indexConfig) {
      let url = `${process.env.COGSEARCH_URL}/indexes/${indexConfig.name}/docs/search?api-version=2021-04-30-Preview`
      const axiosResult = await axios.post(url, body, headers)


      return axiosResult.data
    }

  } catch (err) {
    console.log(err)
  }
  return null
}


const getIndexes = async (): Promise<any[]> => {
  try {

    const headers: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.COGSEARCH_APIKEY
      }
    }

    let url = `${process.env.COGSEARCH_URL}/indexes?api-version=2021-04-30-Preview`
    const axiosResult = await axios.get(url, headers)


    return axiosResult.data.value


  } catch (err) {
    console.log(err)
  }
  return []
}

const iterateObject = (obj): any => {
  let out = {}
  for (const o in obj) {
    if (typeof (obj[o]) == "object") {
      out = iterateObject(obj[o]);
    } else {
      out[o] = obj[o]
      //myobj["value"] = obj[o]
    }
  }
  return out
}

const iterFields = (fields, fieldName) => {
  for (const f of fields) {
    //console.log(f)
    if (f.name === fieldName) {
      return f
    } else if (f?.fields?.length > 0) {
      const outField = iterFields(f.fields, fieldName)
      if (outField) {
        return outField
      }
    }
  }
  return null
}

const getSearchType = (index, fieldName) => {
  const aggResults = index.fields.find(v => v.name === 'aggregatedResults')
  //console.log(aggResults)
  return iterFields(aggResults.fields, fieldName)
}


const discover = async (payload) => {
  //get the first 20 items in the 
  const indexes = await getIndexes()
  const searchResults = await search("", indexes[0], 5)
  const newFacetKeys = Object.keys(searchResults["@search.facets"]).map(k => k.split('/')[k.split('/').length - 1])
  let newFacets = {}
  let iter = 0
  for(const key of Object.keys(searchResults["@search.facets"])){
    const newKey = newFacetKeys[iter]
    const value = searchResults["@search.facets"][key]
    newFacets[newKey] = value
    iter++
  }
  //const indexIter = iterateObject(indexes[0].fields.find(v => { if (v.name === 'aggregatedResults') return v }))
  const _objects = searchResults["value"].map(v => iterateObject(v.aggregatedResults))

  const fieldNames = Object.keys(_objects[0])
  let dataDescription = {}
  let outString = ""

  for (const f of fieldNames) {
    const searchType = getSearchType(indexes[0], f)
    const values = _objects.map(o => o[f])
    let iter = 0
    for (const v of values) {
      let newData = `-  ${f}[${searchType.searchable ? 'searchable : true' : 'searchable : false'},${searchType.filterable ? 'filterable : true' : 'filterable : false'}] :  ${v}\n\n`
      if (newData.length > 10000) {
        newData = newData.slice(0, 10000)
      }

      if (outString.length + newData.length > 8000) {
        const llmOut = await llmData(outString, "North Carolina General Statutes", dataDescription[f])
        dataDescription[f] = llmOut
        outString = newData
      } else {
        outString += newData
      }
      iter++
      console.log(`iter : ${iter}, field :${f}`)
    }
    const llmOut = await llmData(outString, "North Carolina General Statutes", dataDescription[f])
    dataDescription[f] = llmOut

  }
  console.log(dataDescription)
  dataDescription["count"] = searchResults["@odata.count"]
  dataDescription["facets"] = newFacets
  fs.writeFileSync('repoDescription2.json', JSON.stringify(dataDescription))
}

const summary = async() => {
  const indexes = await getIndexes()
  const searchResults = await search("", indexes[0], 5)
  const newFacetKeys = Object.keys(searchResults["@search.facets"]).map(k => k.split('/')[k.split('/').length - 1])
  let newFacets = {}
  let iter = 0
  for(const key of Object.keys(searchResults["@search.facets"])){
    const newKey = newFacetKeys[iter]
    const value = searchResults["@search.facets"][key]
    newFacets[newKey] = value
    iter++
  }
  
}

summary().then(v => {
  console.log(v)
})

discover(payload("what is love?  baby don't hurt me, no mo")).then(v => {
  console.log(v)
}).catch(err => {
  console.log(err)
})




