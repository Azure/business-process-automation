# Business Process Automation Accelerator

## Overview

This accelerator provides a no code Studio for users to quickly build complex, multi-stage AI pipelines across multiple Azure AI and ML Services.  Users can select, and stack, AI/ML Services from across Azure Cognitive Services (OpenAI, Speech, Language, Form Recognizer, ReadAPI), Azure Machine Learning into a **single**, fully integrated **pipeline**. Integration between services is automated by BPA, and once deployed, a web app is created. This customizable UI&ast; provides and drag-n-drop interface for end users to build multi service pipelines. Finally, the user-created pipeline is triggered as soon as the first input file(s) are uploaded, storing the results in a Azure Blob Storage.

## Instructional Videos

> ### Video links currently are not available. Please submit an issue or reach out to contributors if need support.

#### The videos are outdated with regards to result storage.  Results are no longer stored in CosmosDB.  Rather, all data can be found in Blob Storage under the 'results' container.  There you should find folders with the names of your pipelines.  There is also an 'errors' folder.  If a request fails for any reason, the log will be stored there.  There will be three retries before the pipeline gives up and removes the request from the queue.

- [Deployment in Azure](https://bpasource.blob.core.windows.net/source/VideoSeries/Deploy.mp4?sv=2020-04-08&st=2023-03-10T15%3A54%3A39Z&se=2026-06-12T14%3A54%3A00Z&sr=b&sp=r&sig=chMcBfD%2Foc2E05Od8xNkbWprWxHIIc7ApDbVazk2%2BO8%3D)
- [Create Your First Pipeline](https://bpasource.blob.core.windows.net/source/VideoSeries/first%20pipeline-20230310_122701-Meeting%20Recording.mp4?sv=2020-04-08&st=2023-03-10T17%3A51%3A01Z&se=2025-01-16T17%3A51%3A00Z&sr=b&sp=r&sig=Jz8PdJAWkLXnN3QqxEnXogRHtN55FC8emHZoic9TGEE%3D)
- [OpenAI Enterprise Search Using Cognitive Search and Semantic Search](https://bpasource.blob.core.windows.net/source/VideoSeries/enterpriseSearch.mp4?sv=2021-10-04&st=2023-05-15T13%3A35%3A46Z&se=2024-06-21T13%3A35%3A00Z&sr=b&sp=r&sig=ChoYuRwynC%2F2e2I6mDTpMWJm3h6OcBKlcmfc1PhHCmw%3D)

## Deploy to Azure Instructions

### Prerequisities
1. Software and tools:
 - Git: [Download Git](https://git-scm.com/downloads)
 - Node.js 16+ [windows/mac](https://nodejs.dev/en/download/)  [linux/wsl](https://nodejs.dev/en/download/package-manager/)
 - Python 3.11: [Download Python](https://www.python.org/downloads/release/python-3118/)
 - Azure Functions Core Tools: [Func Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-python#install-the-azure-functions-core-tools)
2. Github account (Admin)
3. Azure Resource Group (Owner)
4. Ensure your subscription has **Microsoft.DocumentDB enabled**  
To confirm/enable:  
      - Navigate to your subscription within portal.azure.com  
      - Select Resource Providers at bottom of left navigation pane  
      - Within the Filter by name menu, search for Microsoft.DocumentDB  
      - Once Microsoft.DocumentDB is found, check if the status is marked as "Registered". If marked as "NotRegistered", Select "Register"  
      **Note**: *This process may take several seconds/minutes, be sure to refresh the entire browser periodically*
5. Ensure that you have **accepted terms and conditions for Responsible AI**:  
You must initiate the creation of a "Cognitive services multi-service account" from the Azure portal to review and acknowledge the terms and conditions. You can do so here: [Quickstart: Create a Cognitive Services resource using the Azure portal](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account?tabs=multiservice%2Cwindows).  
Once accepted, you can create subsequent resources using any deployment tool (SDK, CLI, or ARM template, etc) under the same Azure subscription.

1. [Get a Workflow Level Token (Classic)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
2. Fork the repository to a git account of which you are the Admin.
3. Click on the "Deploy to Azure" Button that corresponds to your environment and which patterns you wish to create.  Redis pattern is only required for Vector Search.
4. Only the Resource Group, Forked Repo Personal Access Token (Workflow Level), and Forked Git Repo Url are needed.  The remaining parameters are filled in for you.

### Without OpenAI
[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fbusiness-process-automation%2Fmain%2Ftemplates%2Foneclick.json)

### With OpenAI
[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fbusiness-process-automation%2Fmain%2Ftemplates%2Foneclickoai.json)

### With OpenAI On A Private Network
[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fbusiness-process-automation%2Fmain%2Ftemplates%2Fprivatedeploy.json)


### Steps to Manually Deploy Function App
If your function app does not show any functions after running the scripts above, follow the steps below to deploy manually.

1. Change into src/backend/api subdirectory `cd src/backend/api/`
2. Run `npm install` and `npm run build` to install dependencies and translate typescript files into javascript
3. Zip 'api' directory - Use windows explorer or Zip tool on command line to recursively zip all files (including original TS files and compiled JS files) within the 'api' directory (`src/backend/api/`)
3. Zip 'huggingface' directory - Use windows explorer or Zip tool on command line to recursively zip all files within the 'huggingface' directory (src/backend/huggingface/)
4. In Azure Portal, navigate to Hugging Face Function App Resource > Settings > Environment Values > `WEBSITE_RUN_FROM_PACKAGE` - update value to 1
5. Repeat step 4 for the other BPA Function App Resource in the resource group
5. Login to azure using az login
6. From the terminal, run the following command, `func azure functionapp publish $JS_FUNCTION_APP_NAME --javascript --force --deployment-source-zip $JS_ZIP_FILE_PATH`, where $JS_FUNCTION_APP_NAME is name of BPA function resource and $JS_ZIP_FILE_PATH is a path to zipped archive from 'api' directory
7. From the terminal, run the following command, `func azure functionapp publish $HF_FUNCTION_APP_NAME --python --build remote --force --deployment-source-zip $HF_ZIP_FILE_PATH`, where $HF_FUNCTION_APP_NAME is name of Hagging Face function resource and $HF_ZIP_FILE_PATH is a path to zipped archive from 'huggingface' directory

### With OpenAI and Redis Enterprise (check pricing) for Vector Search
(Deprecated.  Replaced by Cognitive Search with Vector Search Features)

## Document Ingestion Architecture
Once you've created a high-level Resource Group, you'll fork this repository and importing helper libraries, taking advantage of Github Actions to deploy the set of Azure Cognitive Services and manage all of the new Azure module credentials, in the background, within your newly created pipeline. After pipeline deployment, a static webapp will be created with your newly customizable POC UI for building and triggering pipelines.

![](images/high-level-architecture-may-2023.png)  
*Document Ingestion High-level Technical Architecture*  

![](images/sample-pipelines-may-2023.png)  
*Several Sample Pipelines/Patterns Easily Created via the UI's drag-n-drop Interface*  
  
  
1. Pipeline #1: Two examples for creating a quick pipeline for ingesting **text** data, and then adding any of the Azure Language Services to process your text ([See all Azure Language Services Offerings here!](https://learn.microsoft.com/en-us/azure/cognitive-services/language-service/overview)), before visualizing in provided WebApp. The second pattern starts from ingestion of video data, and then adding any of our Video Analyzing Services to process your video! ([See all Azure Video Analyzer Services Offerings here!](https://azure.microsoft.com/en-us/products/video-indexer))

2. Pipeline #2: Quickly create a pipeline leveraging **multiple** Cognitive Services. In this sample pipeline, you can ingest **audio**, transcriber or transliterate with the Azure Speech Service [See all available Azure Speech Services here!](https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/overview), the resulting **text** output will be further extracted / transformed with Azure Language Service, and add another analysis layer with Azure OpenAI models.  

3. Our third sample pipeline is inspired from the [popular Enterprise ChatGPT demo](https://github.com/Azure-Samples/azure-search-openai-demo), providing the backend and popular UI for creating a ChatGPT-like experience over your own data.  

4. Pipeline #4: Popular approach for information retrieval with your own documents using a **vector store** and ChatGPT! Document chunking and vector store implementation is handled by the backend after you create your own pipeline.  
