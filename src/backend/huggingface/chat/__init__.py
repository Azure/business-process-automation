import azure.functions as func
import json

import os
import logging
from approaches.custom import CustomApproach
#import openai
# from azure.identity import DefaultAzureCredential
# from azure.search.documents import SearchClient
# from approaches.retrievethenread import RetrieveThenReadApproach
# from approaches.chataggregate import ChatAggregateApproach
# #from approaches.readretrieveread import ReadRetrieveReadApproach
# # from approaches.readdecomposeask import ReadDecomposeAsk
# # from approaches.chatreadretrieveread import ChatReadRetrieveReadApproach
# from azure.storage.blob import BlobServiceClient
# from azure.core.credentials import AzureKeyCredential


# Replace these with your own values, either in environment variables or directly here
AZURE_BLOB_STORAGE_ACCOUNT = os.environ.get("AZURE_BLOB_STORAGE_ACCOUNT") or "mystorageaccount"
AZURE_BLOB_STORAGE_CONTAINER = os.environ.get("AZURE_BLOB_STORAGE_CONTAINER") or "content"
AZURE_BLOB_STORAGE_CONNECTION_STRING = os.environ.get("AzureWebJobsStorage") or "content"
AZURE_SEARCH_SERVICE = os.environ.get("AZURE_SEARCH_SERVICE") or "gptkb"
AZURE_SEARCH_INDEX = os.environ.get("AZURE_SEARCH_INDEX") or "gptkbindex"
AZURE_SEARCH_APIKEY = os.environ.get("AZURE_SEARCH_APIKEY") or "stuff"
AZURE_OPENAI_SERVICE = os.environ.get("AZURE_OPENAI_SERVICE") or "myopenai"
AZURE_OPENAI_GPT_DEPLOYMENT = os.environ.get("AZURE_OPENAI_GPT_DEPLOYMENT") or "davinci"
AZURE_OPENAI_CHATGPT_DEPLOYMENT = os.environ.get("AZURE_OPENAI_CHATGPT_DEPLOYMENT") or "chat"
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY") or "key"
REDIS_PW = os.environ.get("REDIS_PW") or "pw"
REDIS_URL = os.environ.get("REDIS_URL") or "no url"

DEV = os.environ.get("DEV") or "false"

KB_FIELDS_CONTENT = os.environ.get("KB_FIELDS_CONTENT") or "content"
KB_FIELDS_CATEGORY = os.environ.get("KB_FIELDS_CATEGORY") or "category"
KB_FIELDS_SOURCEPAGE = "filename" #os.environ.get("KB_FIELDS_SOURCEPAGE") or "sourcepage"

# Use the current user identity to authenticate with Azure OpenAI, Cognitive Search and Blob Storage (no secrets needed, 
# just use 'az login' locally, and managed identity when deployed on Azure). If you need to use keys, use separate AzureKeyCredential instances with the 
# keys for each service
# If you encounter a blocking error during a DefaultAzureCredntial resolution, you can exclude the problematic credential by using a parameter (ex. exclude_shared_token_cache_credential=True)
#azure_credential = DefaultAzureCredential()

# Used by the OpenAI SDK
#openai.api_type = "azure"
#openai.api_base = f"https://{AZURE_OPENAI_SERVICE}.openai.azure.com"
#openai.api_version = "2022-12-01"

# Comment these two lines out if using keys, set your API key in the OPENAI_API_KEY environment variable instead
# openai.api_type = "azure_ad"
# openai_token = azure_credential.get_token("https://cognitiveservices.azure.com/.default")
#openai.api_key = OPENAI_API_KEY

# Set up clients for Cognitive Search and Storage
# search_client = SearchClient(
#     endpoint=f"https://{AZURE_SEARCH_SERVICE}.search.windows.net",
#     index_name=AZURE_SEARCH_INDEX,
#     credential=AzureKeyCredential(AZURE_SEARCH_APIKEY))
# blob_client = BlobServiceClient.from_connection_string(AZURE_BLOB_STORAGE_CONNECTION_STRING)
# blob_container = blob_client.get_container_client(AZURE_BLOB_STORAGE_CONTAINER)

# Various approaches to integrate GPT and external knowledge, most applications will use a single one of these patterns
# or some derivative, here we include several for exploration purposes
# ask_approaches = {
#     "rtr": RetrieveThenReadApproach(search_client, AZURE_OPENAI_GPT_DEPLOYMENT, KB_FIELDS_SOURCEPAGE, KB_FIELDS_CONTENT),
#     "rrr": ReadRetrieveReadApproach(search_client, AZURE_OPENAI_GPT_DEPLOYMENT, KB_FIELDS_SOURCEPAGE, KB_FIELDS_CONTENT),
#     "rda": ReadDecomposeAsk(search_client, AZURE_OPENAI_GPT_DEPLOYMENT, KB_FIELDS_SOURCEPAGE, KB_FIELDS_CONTENT)
# }

# chat_approaches = {
#     "rrr": ChatReadRetrieveReadApproach(search_client, AZURE_OPENAI_CHATGPT_DEPLOYMENT, AZURE_OPENAI_GPT_DEPLOYMENT, KB_FIELDS_SOURCEPAGE, KB_FIELDS_CONTENT)
# }


def main(req: func.HttpRequest) -> func.HttpResponse:
    print('Python HTTP trigger function processed a request.')
    if DEV == "false":
            req_json = req.get_json()
            req_body = req_json.get("body")
    else : 
        req_body = req.get_json()
    out = {}
    try:
        approach = CustomApproach(req_body.get("index"))
        #approach = ChatAggregateApproach(blob_client, search_client, AZURE_OPENAI_CHATGPT_DEPLOYMENT, AZURE_OPENAI_GPT_DEPLOYMENT, KB_FIELDS_SOURCEPAGE, KB_FIELDS_CONTENT, req_body.get("index"), REDIS_URL, REDIS_PW) #"rrr" #req_body.get("approach")
        try:
            impl = approach #chat_approaches.get(approach)
            if not impl:
                return ({"error": "unknown approach"}), 400
            r = impl.run(req_body.get("history"),req_body.get("overrides") or {})
            return json.dumps(r)
        except Exception as e:
            logging.exception("Exception in /chat")
            return json.dumps({"error": str(e)})

    except ValueError:
        print(ValueError)

    return json.dumps(out)





