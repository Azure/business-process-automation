from approaches.approach import Approach

from langchain.agents import AgentType, initialize_agent
from langchain.chains import RetrievalQA
from langchain.tools import Tool
from langchain.llms import OpenAI

import os
from approaches.retrievers.cogsearchretriever import CogSearchRetriever
from approaches.retrievers.vectorretriever import VectorRetriever

os.environ["OPENAI_API_TYPE"] = "azure"
os.environ["OPENAI_API_VERSION"] = "2022-12-01"
os.environ["OPENAI_API_BASE"] = "https://"+os.environ["AZURE_OPENAI_SERVICE"]+".openai.azure.com"

class CustomApproach(Approach):
    def __init__(self, index: any):

        self.index = index

    def run(self, history: list[dict], overrides: dict) -> any:
        q = history[-1]["user"]
        llm = OpenAI(temperature=0.0,
        deployment_id=os.environ.get("AZURE_OPENAI_GPT_DEPLOYMENT"), batch_size=3)

        if len(overrides.get("vector_search_pipeline")) > 2:
            vector_retriever = VectorRetriever(overrides.get("vector_search_pipeline"), str(overrides.get("top")))
            qa_vector = RetrievalQA.from_chain_type(llm=llm, chain_type="refine", retriever=vector_retriever)

            tools = [
                Tool(
                    name = "Vector Search",
                    func=qa_vector.run,
                    description="useful for when you need to answer questions."
                ),
            ]

            agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True, return_intermediate_steps=True)

            out = agent({"input":q})
            return {"data_points": out["input"], "answer": out["output"], "thoughts": out["intermediate_steps"]}
        else:

            retriever = CogSearchRetriever(self.index,self.index.get("searchableFields"), overrides.get("top"))
            qa = RetrievalQA.from_chain_type(llm=llm, chain_type="refine", retriever=retriever)

            tools = [
                Tool(
                    name = "Cognitive Search",
                    func=qa.run,
                    description="useful for when you need to answer questions"
                ),
            ]

            agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True, return_intermediate_steps=True)

            out = agent({"input":q})
            return {"data_points": out["input"], "answer": out["output"], "thoughts": out["intermediate_steps"]}