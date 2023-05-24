import openai
from azure.search.documents import SearchClient
from azure.search.documents.models import QueryType
import redis
from approaches.approach import Approach
from text import nonewlines
import requests
import os
import json
from azure.storage.blob import BlobServiceClient
from redis.commands.search.query import Query
import numpy


OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Simple retrieve-then-read implementation, using the Cognitive Search and OpenAI APIs directly. It first retrieves
# top documents from search, then constructs a prompt with them, and then uses OpenAI to generate an completion 
# (answer) with that prompt.
class ChatReadRetrieveReadApproach(Approach):
    prompt_prefix = """<|im_start|>system
Assistant helps answer questions within text from documents. Be brief in your answers.
Answer ONLY with the facts listed in the list of sources below. If there isn't enough information below, say you don't know. Do not generate answers that don't use the sources below. If asking a clarifying question to the user would help, ask the question. 
Each source has a name followed by colon and the actual information, always include the source name for each fact you use in the response. Use square brakets to reference the source, e.g. [info1.txt]. Don't combine sources, list each source separately, e.g. [info1.txt][info2.pdf].
{follow_up_questions_prompt}
{injected_prompt}
Sources:
{sources}
<|im_end|>
{chat_history}
"""

    follow_up_questions_prompt_content = """Generate three very brief follow-up questions that the user would likely ask next . 
    Use double angle brackets to reference the questions, e.g. <<Are there exclusions for prescriptions?>>.
    Try not to repeat questions that have already been asked.
    Only generate questions and do not generate any text before or after the questions, such as 'Next Questions'"""

    query_prompt_template = """Below is a history of the conversation so far, and a new question asked by the user that needs to be answered by searching in a knowledge base.
    Generate a search query based on the conversation and the new question. 
    Do not include cited source filenames and document names e.g info.txt or doc.pdf in the search query terms.
    Do not include any text inside [] or <<>> in the search query terms.
    If the question is not in English, translate the question to English before generating the search query.

Chat History:
{chat_history}

Question:
{question}

Search query:
"""

    def __init__(self, blob_client: BlobServiceClient, search_client: SearchClient, chatgpt_deployment: str, gpt_deployment: str, sourcepage_field: str, content_field: str, index: any, redis_url: str, redis_pw : str):
        self.search_client = search_client
        self.chatgpt_deployment = chatgpt_deployment
        self.gpt_deployment = gpt_deployment
        self.sourcepage_field = sourcepage_field
        self.content_field = content_field
        self.index = index
        self.redis_url = redis_url
        self.redis_pw = redis_pw
        self.blob_client = blob_client

    def getText(self, searchables, doc):
        if searchables == None:
            return ""
        if len(searchables) == 0:
            return ""
        out = ""
        for s in searchables:
            currentData = doc
            for i in s.split('/'):
                if  isinstance(currentData.get(i), list):
                    currentData = currentData.get(i)[0]
                else:
                    currentData = currentData[i]
                if isinstance(currentData, str):
                    out = out + currentData
        return out
    
    def sourceFile(self, doc):
        if self.sourcepage_field in doc:
            return doc[self.sourcepage_field]
        elif "content" in doc and self.sourcepage_field in doc["content"]:
            return doc["content"][self.sourcepage_field]
        else:
            return "No Filename Found: "

    def run(self, history: list[dict], overrides: dict) -> any:
        q = history[-1]["user"]
        use_semantic_captions = True if overrides.get("semantic_captions") else False
        top = overrides.get("top") or 3
        exclude_category = overrides.get("exclude_category") or None
        filter = "category ne '{}'".format(exclude_category.replace("'", "''")) if exclude_category else None

        if len(overrides.get("vector_search_pipeline")) > 2:
            headers = {
                "api-key" : OPENAI_API_KEY,
                "Content-Type" : "application/json"
            }

            url =  "https://"+os.environ.get("AZURE_OPENAI_SERVICE")+".openai.azure.com/"+"openai/deployments/"+"text-search-curie-query-001"+"/embeddings?api-version=2022-12-01"
            requestOut = requests.post(url, json = {'input' : history[-1]["user"]}, headers=headers)
            output = json.loads(requestOut.text)
            embeddings = output["data"][0]["embedding"]

            np_vector = numpy.array(embeddings, dtype=numpy.float32)
            
            
            r = redis.Redis.from_url(url = self.redis_url, password=self.redis_pw)
            query = "(@pipeline:"+overrides.get("vector_search_pipeline")+")=>[KNN "+ str(overrides.get("top")) +" @v $BLOB AS dist]"
            redisQuery = Query(query).return_field("dist").sort_by("dist").dialect(2)
            searchOut = r.ft("bpaindexfilterada").search(redisQuery, query_params={"BLOB": np_vector.tobytes() })

            docs = []
            for doc in searchOut.docs:
                blobOut = self.blob_client.get_blob_client("results", overrides.get("vector_search_pipeline") + "/" + doc.id + ".json")
                blobDownload = blobOut.download_blob().content_as_text()
                blobDocument = json.loads(blobDownload)
                del blobDocument["aggregatedResults"]["openaiEmbeddings"]
                docs.append(blobDocument)
            
            results = ""
            if len(docs) > 0:
                if "text" in docs[0]["aggregatedResults"]:
                    results = [self.sourceFile(doc) + ": " + nonewlines(doc["aggregatedResults"]["text"]) for doc in docs]
                elif "ocrToText" in docs[0]["aggregatedResults"]:
                    results = [self.sourceFile(doc) + ": " + nonewlines(doc["aggregatedResults"]["ocrToText"]) for doc in docs]
                else:
                    results = [self.sourceFile(doc) + ": " + nonewlines(doc["aggregatedResults"]["sttToText"]) for doc in docs]
                content = "\n".join(results)

        else:
            # STEP 1: Generate an optimized keyword search query based on the chat history and the last question
            prompt = self.query_prompt_template.format(chat_history=self.get_chat_history_as_text(history, include_last_turn=False), question=history[-1]["user"])
            completion = openai.Completion.create(
                engine=self.gpt_deployment, 
                prompt=prompt, 
                temperature=0.0, 
                max_tokens=32, 
                n=1, 
                stop=["\n"])
            q = completion.choices[0].text

            if overrides.get("semantic_ranker"):
                r = self.search_client.search(q, 
                                            filter=filter,
                                            query_type=QueryType.SEMANTIC, 
                                            query_language="en-us", 
                                            query_speller="lexicon", 
                                            semantic_configuration_name="default", 
                                            top=top, 
                                            query_caption="extractive|highlight-false" if use_semantic_captions else None)
                
            else:
                r = self.search_client.search(q, filter=filter, top=top)

            if use_semantic_captions:
                results = [doc[self.sourcepage_field] + ": " + nonewlines(" . ".join([c.text for c in doc['@search.captions']])) for doc in r]
            else:
                results = [self.sourceFile(doc) + ": " + nonewlines(self.getText(self.index.get("searchableFields"), doc)) for doc in r]
            content = "\n".join(results)

        follow_up_questions_prompt = self.follow_up_questions_prompt_content if overrides.get("suggest_followup_questions") else ""
        
        # Allow client to replace the entire prompt, or to inject into the exiting prompt using >>>
        prompt_override = overrides.get("prompt_template")
        if prompt_override is None:
            prompt = self.prompt_prefix.format(injected_prompt="", sources=content, chat_history=self.get_chat_history_as_text(history), follow_up_questions_prompt=follow_up_questions_prompt)
        elif prompt_override.startswith(">>>"):
            prompt = self.prompt_prefix.format(injected_prompt=prompt_override[3:] + "\n", sources=content, chat_history=self.get_chat_history_as_text(history), follow_up_questions_prompt=follow_up_questions_prompt)
        else:
            prompt = prompt_override.format(sources=content, chat_history=self.get_chat_history_as_text(history), follow_up_questions_prompt=follow_up_questions_prompt)

        if len(prompt) > 7000:
            prompt = prompt[:7000]
        # STEP 3: Generate a contextual and content specific answer using the search results and chat history
        completion = openai.Completion.create(
            engine=self.chatgpt_deployment, 
            prompt=prompt[:7000], 
            temperature=overrides.get("temperature") or 0.7, 
            max_tokens=1024, 
            n=1, 
            stop=["<|im_end|>", "<|im_start|>"])

        return {"data_points": results, "answer": completion.choices[0].text, "thoughts": f"Searched for:<br>{q}<br><br>Prompt:<br>" + prompt.replace('\n', '<br>')}
    
    def get_chat_history_as_text(self, history, include_last_turn=True, approx_max_tokens=1000) -> str:
        history_text = ""
        for h in reversed(history if include_last_turn else history[:-1]):
            history_text = """<|im_start|>user""" +"\n" + h["user"] + "\n" + """<|im_end|>""" + "\n" + """<|im_start|>assistant""" + "\n" + (h.get("bot") + """<|im_end|>""" if h.get("bot") else "") + "\n" + history_text
            if len(history_text) > approx_max_tokens*4:
                break    
        return history_text