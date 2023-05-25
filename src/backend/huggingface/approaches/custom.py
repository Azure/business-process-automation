from approaches.approach import Approach
from approaches.retrievers.cogsearchfacetsretriever import CogSearchFacetsRetriever

from langchain.agents import AgentType, initialize_agent
from langchain.chains import RetrievalQA
from langchain.tools import Tool
from langchain.llms import OpenAI
import json

import os
from approaches.retrievers.cogsearchretriever import CogSearchRetriever
from approaches.retrievers.vectorretriever import VectorRetriever

os.environ["OPENAI_API_TYPE"] = "azure"
os.environ["OPENAI_API_VERSION"] = "2022-12-01"
os.environ["OPENAI_API_BASE"] = "https://"+os.environ["AZURE_OPENAI_SERVICE"]+".openai.azure.com"

class CustomApproach(Approach):
    def __init__(self, index: any):
        self.index = index

    def get_thought_string(self, intermediate_steps):
        thoughts = ""
        data_points = []
        try:
            
            for i in intermediate_steps:
                for j in i:
                    if isinstance(j, str):
                        data_points.append("<br> Observation: " +step + "</br>")
                        thoughts = thoughts + "<br> Observation: " +step + "</br>"
                    else :
                        for step in j:
                            if isinstance(step, str):
                                data_points.append("<br> " +step + "</br>")
                                thoughts = thoughts + "<br> " +step + "</br>"
                  
        except:
            thoughts = ""
        return thoughts, data_points

    def run(self, history: list[dict], overrides: dict) -> any:
        q = history[-1]["user"]
        llm = OpenAI(temperature=0.0,
        deployment_id=os.environ.get("AZURE_OPENAI_GPT_DEPLOYMENT"), batch_size=3)

        tools = []
        if len(overrides.get("vector_search_pipeline")) > 2: 
            vector_retriever = VectorRetriever(overrides.get("vector_search_pipeline"), str(overrides.get("top")))
            qa_vector = RetrievalQA.from_chain_type(llm=llm, chain_type="refine", retriever=vector_retriever)
            tools.append(Tool(
                    name = "Vector Search",
                    func=qa_vector.run,
                    description="useful for when you need to answer questions."
                ))
        else:
            retriever = CogSearchRetriever(self.index,self.index.get("searchableFields"), overrides.get("top"))
            qa = RetrievalQA.from_chain_type(llm=llm, chain_type="refine", retriever=retriever)
            # retriever_facets = CogSearchFacetsRetriever(self.index,self.index.get("searchableFields"), overrides.get("top"))
            # qa_facets = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever_facets)
            tools.append(Tool(
                    name = "Cognitive Search",
                    func=qa.run,
                    description="useful for when you need to answer questions"
                ))
            # tools.append(Tool(
            #         name = "Cognitive Search Facets",
            #         func=qa_facets.run,
            #         description="useful to get sentiment data for the results of a query"
            #     ))

        agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True, return_intermediate_steps=True,max_iterations=3)
        out = agent({"input":q})
        thoughts, data_points = self.get_thought_string(out["intermediate_steps"])
        return {"data_points": [], "answer": out["output"], "thoughts": thoughts}