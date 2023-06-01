import requests
import json
import numpy
import redis
from redis.commands.search.query import Query
from azure.storage.blob import BlobServiceClient
from langchain.schema import Document, BaseRetriever
from typing import List
import os

class VectorRetriever(BaseRetriever):
    def __init__(self, index : str, top : int ):
       self.index = index
       self.top = top

    def nonewlines(self, s: str) -> str:
        return s.replace('\n', ' ').replace('\r', ' ')
    
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
    
    def get_relevant_documents(self, queryString: str) -> List[Document]:
        blob_client = BlobServiceClient.from_connection_string(os.environ["AzureWebJobsStorage"])

        headers = {
            "api-key" : os.environ["OPENAI_API_KEY"],
            "Content-Type" : "application/json"
        }

        url =  "https://" + os.environ["AZURE_OPENAI_SERVICE"]+".openai.azure.com/openai/deployments/"+"text-search-ada-query-001"+"/embeddings?api-version=2022-12-01"
        requestOut = requests.post(url, json = {'input' : queryString}, headers=headers)
        output = json.loads(requestOut.text)
        embeddings = output["data"][0]["embedding"]

        np_vector = numpy.array(embeddings, dtype=numpy.float32)
        
        r = redis.Redis.from_url(url = os.environ["REDIS_URL"], password=os.environ["REDIS_PW"])
        query = "(@pipeline:"+self.index+")=>[KNN "+self.top+" @v $BLOB AS dist]"
        redisQuery = Query(query).return_field("dist").sort_by("dist").dialect(2)
        searchOut = r.ft("bpaindexfilterada").search(redisQuery, query_params={"BLOB": np_vector.tobytes() })
        docs = []
        for doc in searchOut.docs:
            blobOut = blob_client.get_blob_client("results", self.index + "/" + doc.id + ".json")
            blobDownload = blobOut.download_blob().content_as_text()
            blobDocument = json.loads(blobDownload)
            del blobDocument["aggregatedResults"]["openaiEmbeddings"]
            blobDocument["source"] = blobDocument["filename"]
            docs.append(Document(page_content=self.nonewlines("["+ blobDocument["filename"] +"]"+self.getText(["aggregatedResults/text"], blobDocument)),metadata={"sources":blobDocument["filename"]}))
        return docs
        

    async def aget_relevant_documents(self, query: str) -> List[Document]:
        """Get documents relevant for a query.

        Args:
            query: string to find relevant documents for

        Returns:
            List of relevant documents
        """

    
        return self.get_relevant_documents(query)