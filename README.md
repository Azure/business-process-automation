# Business Process Automation Accelerator

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fbusiness-process-automation%2Fmain%2Ftemplates%2Foneclick.json)


## New!! Integrate OpenAI into Cog Search!  January 31, 2023
1. Use the "Deploy to Azure" for initial deployment.  Instructions are below.
2. In Azure - Create an OpenAI instance (south central us has the most models).  Create three deployments:  text, searchdoc, searchquery.
4. In the Azure Function that you created (the one that does not say Huggingface), add the following Application Settings and fill them in from the services that you just created.
5. In the Configuration for the Static Web Application, add the Application Settings
6. Create a new pipeline to OCR your pdfs.
7. Drop in some documents in that pipeline.
8. Ingest those PDF's into Cognitive Search 
9. Go to Sample Search Application in the UI.  
10. Toggle 'OpenAI Answers'
```
    "OPENAI_KEY" : "",
    "OPENAI_ENDPOINT" : "https://yourservice.openai.azure.com/",
    "OPENAI_DEPLOYMENT_TEXT" : "name of your text model deployment",
```

## Add OpenAI Completions To Your Pipeline!!  January 31, 2023
1. Use the "Deploy to Azure" for initial deployment.  Instructions are below.
2. In Azure - Create an OpenAI instance (south central us has the most models).  Create three deployments:  text, searchdoc, searchquery.
4. In the Azure Function that you created (the one that does not say Huggingface), add the following Application Settings and fill them in from the services that you just created.
5. Create a new pipeline for processing your documents or audio.  Example, pdf->ocr->ocrToText->openAIGeneric. 
6. Drop in some documents in that pipeline.
7. Go to OpenAI Viewer in the UI.  
```
    "OPENAI_KEY" : "",
    "OPENAI_ENDPOINT" : "https://yourservice.openai.azure.com/",
    "OPENAI_DEPLOYMENT_TEXT" : "name of your text model deployment",
```

## Vector Search is new!!  January 19, 2023

1. Use the "Deploy to Azure" for initial deployment.  Instructions are below.
2. In Azure - Create a Azure Enterprise Redis Cache.  It MUST be Enterprise to have the vector search capabilities.  Collect the endpoint and password.
3. In Azure - Create an OpenAI instance (south central us has the most models).  Create three deployments:  text, searchdoc, searchquery.
4. In the Azure Function that you created (the one that does not say Huggingface), add the following Application Settings and fill them in from the services that you just created.
5. Create a new pipeline for processing your documents or audio.  Example, pdf->ocr->ocrToText->openAiEmbeddings
6. Drop in some documents in that pipeline.
7. Go to Vector Search Application in the UI.  
```
    "OPENAI_KEY" : "",
    "OPENAI_REGION" : "southcentralus",
    "OPENAI_ENDPOINT" : "https://yourservice.openai.azure.com/",
    "OPENAI_DEPLOYMENT_TEXT" : "bpatesttext",
    "OPENAI_DEPLOYMENT_SEARCH_DOC" : "bpatestsearchdoc",
    "OPENAI_DEPLOYMENT_SEARCH_QUERY" : "bpatestsearchquery",
    "REDIS_URL" : "rediss://yourService.eastus.redisenterprise.cache.azure.net:10000",
    "REDIS_PW" : "",
    "STORE_IN_REDIS" : "true",
```

## Deploy Button is new!!  January 15, 2022

1.  Fork this to your git repo
2.  Get a 'workflow' level, classic, personal token from you Github Account.  Instructions for this are lower in the readme.
3.  You need to name your project something unique.  It is highly recommended to avoid using dashes or even uppercase letters.  Stick to lowercase alpha-numerics.
4.  Click the "Deploy to Azure" button and fill in only the first three parameters:  Project Name, Token, Forked Github URL.
5.  The first time, it is likely that you will have a problem installing the Cognitive Services Multi-Service instance.  It requires that you agree to terms of use and you cannot do this within a template.  The solution is to create an instance, and delete it.  You will then be able to run the full template.  Instructions for creating this are lower in the readme.


## Overview

This accelerator provides a no code Studio for users to quickly build complex, multi-stage AI pipelines across multiple Azure AI and ML Services.  Users can select, and stack, AI/ML Services from across Azure Cognitive Services (Speech, Language, Form Recognizer, ReadAPI), Azure Machine Learning, and even Hugging Face state-of-the-art models, into a **single**, fully integrated **pipeline**. Integration between services is automated by BPA, and once deployed, a web app is created. This customizable UI&ast; provides and drag-n-drop interface for end users to build multi service pipelines. Finally, the user-created pipeline is triggered as soon as the first input file(s) are uploaded, storing the results in a CosmosDB.

And, optionally, the end-user can add a Cognitive Search Index, indexing each the output at each of stage of the pipeline, across all uploaded files. Index creation is handled entirely by the accelerator, where the end-user can access the index via their newly created Cognitive Search Index resource
  
<br/><br/> 
![](images/high-level-architecture.png)  
*High-level architecture*
<br/><br/>
  
&ast;*Note*: [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/overview) allows you to easily build [React](https://reactjs.org/) apps in minutes. Use this repo with the [React quickstart](https://docs.microsoft.com/azure/static-web-apps/getting-started?tabs=react) to build and customize a new static site and automate the deployment of a functional, and customizable, POC for text and language processing.  
 
---

## Contents  
- [Overview](#overview)  
- [Architecture](#architecture)  
- [Sample Pipeline](#sample-pipeline)  
- [Currently Inluded Algorithms](#currently-included-algorithms)  
- [Prerequisities](#prerequisities)  
- [Installation Steps](#installation-steps)  
  - [Create a Resource Group](#1-create-a-resource-group-in-your-azure-portal)
  - [Fork the repo](#2-fork-the-repo)
  - [Create AND save personal access token](#3-create-and-save-personal-access-token)
  - [Clone local repo for deployment](#4-navigate-to-and-open-for-editing-templatesparametersjsonexample-in-your-local-directory)
  - [Run initial deployment configuration](#5-run-initial-deployment-configuration)
  - [Create action to deploy](#6-collect-the-published-profiles-from-your-newly-created-azure-function-apps)
  - [Create GitHub Action to build the code and deploy it to your Function Apps](#6-create-github-action-to-your-function-apps-deploying-your-front-and-back-end-resources)
- [Go to your React App](#go-to-your-react-app)
- [Load Documents!](#load-documents)
- [View Your Results](#view-your-results)
- [Further Customization](#further-customization)
- [Contacts](#contacts)  
- [Roadmap](#roadmap)
- [References](#references)  
---



## Architecture
Once you've created a high-level Resource Group, you'll fork this repository and importing helper libraries, taking advantage of Github Actions to deploy the set of Azure Cognitive Services and manage all of the new Azure module credentials, in the background, within your newly created pipeline. After pipeline deployment, a static webapp will be created with your newly customizable POC UI for building and triggering pipelines.

![](images/architecture_original_plus_huggingface_v2.png)  
*High-level technical architecture*  

The UI provides and drag-n-drop interface for end users to build multi-service pipelines:
  1.	Starting with specifying input file type(s), e.g. audio, texts, or emails
  2.	Pipeline stages are added by selecting which Cognitive Services to add to the pipeline 
  3.	Once a new pipeline stage is added, if the data is transformed to a new format type (e.g. OCR’ing a PDF to text), the new pipeline stages will become available to be added based on the transformed format of the data at the latest stage of the pipeline
  4.	Once the pipeline is specified, the user will upload files through the UI, triggering the pipeline, and saving the result in a CosmosDB
  5.	Optionally, the end-user can add a Cognitive Search Index, indexing each the output at each of stage of the pipeline, across all uploaded files. Index creation is handled entirely by the accelerator, where the end-user can access the index via their newly created Cognitive Search Index resource  

<br/><br/>
![](images/overview.png)  
*BPA UI*
<br/><br/>  

## Sample Pipeline  
A simple example pipeline for a call center mining use case is below is illustrated below. For a general call center mining use case, the Business Process Accelerator could be used to deploy a pipeline ingesting, transcribing, (+optionally translating), summarizing, and analyzing the sentiment for each call.
Resulting Pipeline Steps [AI Service Deployed]:  

1.	Transcribe audio calls [Speech Service]  
2.	Translate to another language (optional) [Speech Service]  
3.	Store the transcribed and translated calls [CosmosDB]  
4.	Apply suite of text analytics offerings (e.g. text summarization, sentiment analysis, call classification) [Language Service]  

The resulting deployment pipeline leverages: 
Azure Speech Service, Azure Language Service, Azure Cosmos DB, Azure Functions
<br/><br/>
![](images/sample_pipeline_call_center_mining.png)  
*Sample BPA pipeline for call center mining*   

Once the pipeline is completed – this process typically takes <1 min for smaller documents and simpler pipelines – the results are found in your newly created Azure Cosmos DB, where we can quickly inspect our results.
<br/><br/>
![](images/sample_output_call_center_mining.png.png)  

## Currently Included Services
The current release of BPA allows you to build pipelines from multiple Cognitives Services, Azure Machine Learning Endpoints, and even Hugging Face models. New Services and Features are continuously being released. Please refer to each Service's documentation for the latest reference. 

### Available Services
- Azure Cognitive Services
  - Form Recognizer
  - Language Service
  - Speech Service
  - Cognitive Search
- Azure Machine Learning Endpoints
- HuggingFace Tokenization Models  


#### Form Recognizer Models  

| Type | Model | Description |
| -----| ----- | ----------- |
| Prebuilt |Read (preview)	| Extract printed and handwritten text lines, words, locations, and detected languages. |
| | General document (preview) |	Extract text, tables, structure, key-value pairs, and named entities.|
| | Layout |	Extract text and layout information from documents.|  
| | W-2 (preview) |	Extract employee, employer, wage information, etc. from US W-2 forms.|
| |Invoice	| Extract key information from English and Spanish invoices.|
| |Receipt	| Extract key information from English receipts.|
| |ID document	| Extract key information from US driver licenses and international passports.|
| |Business card	| Extract key information from English business cards.|  
| Custom | Custom |	Extract data from forms and documents specific to your business. Custom models are trained for your distinct data and use cases. |
| Custom | Composed |	Compose a collection of custom models and assign them to a single model built from your form types.|  

[Form Recognizer Models Documentation](https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/concept-model-overview)  
  
  
#### Language Service Models

| Type | Model | Description |
| -----| ----- | ----------- |
| Prebuilt |Named Entity Recognition (NER)|	This pre-configured feature identifies entities in text across several pre-defined categories.|
| |Personally Identifiable Information (PII) detection	|This pre-configured feature identifies entities in text across several pre-defined categories of sensitive |information, such as account information.|
| |Key phrase extraction|	This pre-configured feature evaluates unstructured text, and for each input document, returns a list of key phrases and main points in the text.|
| |Entity linking	|This pre-configured feature disambiguates the identity of an entity found in text and provides links to the entity on Wikipedia.|
| |Text Analytics for health|	This pre-configured feature extracts information from unstructured medical texts, such as clinical notes and doctor's notes.|
| Custom |Custom NER|	Build an AI model to extract custom entity categories, using unstructured text that you provide.|
| Prebuilt |Analyze sentiment and opinions|	This pre-configured feature provides sentiment labels (such as "negative", "neutral" and "positive") for sentences and documents. This feature can additionally provide granular information about the opinions related to words that appear in the text, such as the attributes of products or services.|
| Custom |Custom text classification (preview)	|Build an AI model to classify unstructured text into custom classes that you define.|
| Prebuilt |Text Summarization (preview)	|This pre-configured feature extracts key sentences that collectively convey the essence of a document.|

[Language Service Models Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/overview)  
  
  
#### Speech Service
The Speech service provides speech-to-text and text-to-speech capabilities with an Azure Speech resource. You can transcribe speech to text with high accuracy, produce natural-sounding text-to-speech voices, translate spoken audio, and use speaker recognition during conversations.  
[Speech Service Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/overview)  
  
  
#### Cognitive Search
Cloud search over private heterogeneous content, with options for AI enrichment if your content is unstructured or unsearchable in raw form.  
[Cognitive Search Documentation](https://docs.microsoft.com/en-us/azure/search/)  
  
  
#### Hugging Face Implementation
Many of the pretrained models from the Hugging Face library can be used, depending on the task selected! Find more information at https://huggingface.co/models?pipeline_tag=text-classification&sort=downloads

![](images/hugging_face_models.png)
*Hugging Face model repository*

---
## Prerequisities
1. **Github account**
2. **Azure Command Line interface** installed. The Azure Command-Line Interface (CLI) is a cross-platform command-line tool that can be installed locally on Windows computers. You can use the Azure CLI for Windows to connect to Azure and execute administrative commands on Azure resources. This accelerator uses Azure CLI to deploy a set of services provided by the templates within your cloned repo, in just a few lines of code.  
(https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)  
3. Ensure your subscription has **Microsoft.DocumentDB enabled**  
To confirm/enable:  
      - Navigate to your subscription within portal.azure.com  
      - Select Resource Providers at bottom of left navigation pane  
      - Within the Filter by name menu, search for Microsoft.DocumentDB  
      - Once Microsoft.DocumentDB is found, check if the status is marked as "Registered". If marked as "NotRegistered", Select "Register"  
      **Note**: *This process may take several seconds/minutes, be sure to refresh the entire browser periodically*
4. Ensure that you have **accepted terms and conditions for Responsible AI**:  
You must create your first Face, Language service, or Computer Vision resources from the Azure portal to review and acknowledge the terms and conditions. You can do so here: [Quickstart: Create a Cognitive Services resource using the Azure portal](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account?tabs=multiservice%2Cwindows).  
Once accepted, you can create subsequent resources using any deployment tool (SDK, CLI, or ARM template, etc) under the same Azure subscription.
  
  ---
## Installation Steps  

## 1. Create a Resource Group in your Azure Portal
Create your Resource Group.  
**Note**: *When naming your Resource Group, please use lower case, alphanumeric characters only, as multiple Azure Services will be created later on, in the background, using your Resource Group name*  
  
Select your preferred Region  

![](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/media/manage-resource-groups-portal/manage-resource-groups-add-group.png)    
https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal  
  

It will take several seconds for your Resource Group to be created.  

![](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/media/manage-resource-groups-portal/manage-resource-groups-create-group.png)    
For more help, refer to https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal  

## 2. Fork the repo
Fork https://github.com/Azure/business-process-automation to your github account.  
For basic instructions for forking repos, please refer to https://docs.microsoft.com/en-us/azure/devops/repos/git/forks?view=azure-devops&tabs=visual-studio  
**Note**: *a Microsoft organization GitHub account is **not** required*  

## 3. Create AND save personal access token
1.  On your Git Hub repo page, click on your profile  
2.  Select Settings (under your profile icon in the top right)  
  
![](images/settings_upper_right.png)  
  
3. Select Developer settings at bottom of left navigation pane  
  
![](images/settings_upper_right_v2.png)  
  
4.  Select Personal access tokens  
5.  Select Generate new token  
6.  Under Select scopes, select the checkbox for "workflow"  
  ![](images/personal_access_tokens_configuration.png)  
7. Add your own note  
8. Select Generate token (at bottom of page)  
9.  Copy your newly generated token  
**Note**: *Be sure to save this token for completing pipeline setup, else this token will need to be regenerated*  
  
  For more help refer to https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate

## 4. Update depoloyment template files within local repo  
In step 4, you'll clone your repo locally, and make small updates to two deployment template files, which will automate deployment of multiple Azure resources within your Resource group.  
  
Navigate to and open for editing, templates/parameters.json.example in your local directory
1. Open a local command window  
2. Clone the forked repo locally  
```
git clone https://github.com/<your-account>/business-process-automation
```  
3. Navigate to  your templates/parameters.json.example within your local repo  
```
cd business-process-automation/templates
```  
4. Rename the file to "parameters.json"  
**Note**: *This is an important step to ensure successful deployment*. The file can be renamed via the command line, a local File Explorer browser, or after opening via Visual Studio Code (see the below note)  
```
ren parameters.json.example parameters.json
```  
5. Open parameters.json
**Note**:*If you have Visual Studio Code installed, you can launch at the current directory by typing "code ."  
```
C:\Users\<UserName>\business-process-automation\templates\code .
```  
Update the three "value" fields below:  

![](images/update3valueFields.png)  

    1. projectName: Must be a unique project name, only include lowercase, alphanumeric characters only, and keep length between ~10-16 characters. This name is used across multiple Azure resources, many with strict project naming conventions  
    2. repository token: Copy the personal access token you recently created  
    3. repository url: Paste the link of your forked repository - i.e., https://github.com/[your-account]/business-process-automation  
  
  Save updates  
  
6. Similarly, update your local deploy.yml file within the same directory
  1. Open the file C:\Users\<UserName>\business-process-automation\templates\deploy.yml
  2. Update the field AZURE_FUNCTIONAPP_NAME with the name of your ResourceGroup  
  **Note**: *You will later use this file to create a GitHub workflow, kicking off configuration of your Resource Group pipeline components*
  ![](images/updateDeploy_yml.png)  

  
  Save updates
  
## 5. Run initial deployment configuration  
1. In your local repository, navigate to the 'templates' directory  
2. Run the below deployment code in your cmd window, after updating with your own project name and Resource Group  
```
  az deployment group create --name [yourProjectName] --resource-group <YourResourceGroup> --template-file main.json --parameters parameters.json
```  
  **Note**: *Be sure to maintain spaces while updating the project name and resource group*  
  **Note**: *This may take several minutes to run*  
  
3. When this has completed you should have the application infrastructure deployed to your resource group. You will see confirmation of numerous created Azure resources in your command window. Navigate to your Resource Group at your Azure Portal confirm to confirm your newly created resources.  
`azure.portal.com`   
  
## 6. Collect the Published Profiles from your newly created Azure Function Apps  
  In this sequence of steps you will retrieve credentials from your two newly created Azure Function Apps, and add them as Secrets in your GitHub repo.  
1.  You will have two new function apps deployed within your Resource Group.  Navigate to your Resource Group at your Azure Portal.  
One will start with the name "huggingface".  
  
![](images/newly_created_function_apps.png)  
  
Open the "huggingface" function app and in the "overview" tab there will be a button "Get publish profile" in the top center, which will then download a file. This will download as "[YourProjectName].PublishSettings.txt"  
**Note**: *It may take several seconds for the button to appear*  
   
  ![](images/get_publish_profile.png)  
2. Open the downloaded file, and copy the contents (to be pasted in upcoming steps)  
3. Navigate back to your forked repo, go to Settings (local settings in the middle center) -> Secrets -> Actions  
  
  ![](images/secrets_actions.png)  
4. Select 'New Repository Secret'  
  - Paste the below name into the "Name" field
  ```
  AZURE_HF_FUNCTIONAPP_PUBLISH_PROFILE
  ```  
  - Paste the contents of your recently downloaded "[YourProjectName].PublishSettings.txt" file into the "Value" field
5. Repeat Steps 1-4 above the same process for the second newly created Azure Function App within your Resource Group, with the same name as your project name.  
  **Note**: *For step 4 above, this second secret will be named* 
  ```
  AZURE_FUNCTIONAPP_PUBLISH_PROFILE
  ```  


## 6. Create Github Action to your Function Apps, deploying your front and back end resources
1. Navigate to "actions" tab  
2. Select "new workflow"
3. Select set up workflow yourself
  ![](images/set_up_workflow_v3.png)
4. This will take you to the editor for the main.yml file. 
Delete all of the contents within the main.yml file. Copy all of the contents from your deploy.yml file from your **local** directory.  
(C:\Users\[UserName]\business-process-automation\templates\main.json) into the body.  
![](images/deploy_yml.png)
Finally, paste that selection into the editor window.
5. Run the workflow and select commit new file  
  **Note**: *Once you've run your workflow once, you'll want to delete previous workflow runs to prevent buildup of old workflows.*  
    - Select "Start Commit"
    - Select "Commit New File"
6. View the progress of your actions under the "Actions" tab.  This process will take several minutes to complete. 
  You can also view real-time logs from your Azure Function Apps:
    - Navigate to your Azure Portal, and select your Function APP, named after your project name  
    - Select "Log Stream" in the left navigation pane (towards the bottom; may have to scroll down)
    - Switch the stream from "File System Logs" to "App Insights Logs" via the drop down menu, directly above your log window
 
## Navigate to your React App!  
1. Navigate to your Resource Group within your Azure Portal
2. Select your static webapp  
3. Within the default Overview pane, Click on your URL, which will take you to your newly launced WebApp!  
 
 ![](images/find_static_web_app2.png)
 
 
## Load Documents!
1. Select Configure a New Pipeline  
**Important: When naming your pipeline, please choose a length greater then 5 characters to satisfy naming requirements of various Azure Services created through the pipeline**  
![](images/app_landing_page.png)  
2. Select your input file(s) type  
**Note**: *The .pdf input tile can accomodate several image input file format types (including, JPEG, PNG, BMP, TIFF)* More information at https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/faq  
Generally, please refer to the supported file types required by the various Azure Cognitive Services (documentation sections linked in Reference).
3. Next, continue building your pipepline by selelecting which analytical service you would like to apply:
    - Depending on your selection, new analytical services will appear. For example, if you start your pipeline with a .pdf document, your available Services within the pipeline builder will show Services compatible with .pdf inputs (e.g. Form Recognizer General Layout Pretrainted model). After adding a pipeline step, such as the aforementioned Layout Service, your data may be transformed to a different output (in this case text), and your pipeline builder will now show Services compatible with text inputs (e.g. Language Services such as text summarization).  
  
![](images/pdf_2views.png)  
Alternatively, you can first OCR the raw image to text, by selecting Form Recognizer's OCR Service, after which your app will show new options that are available to you for processing converted text  
  
![](images/text_options.png)  
4. To complete your pipeline, select the tile "Export Last Stage to DB"  
5. Navigate to "Home"  
  
![](images/home.png)  
6. Select "Ingest Documents"  
7. Upload your first document! Once your document upload is completed, You'll see a message indicating "Upload Successful". You can upload more than one document at a time here.  
**Note**: *The first document loaded may take several minutes. However, all subsequent documents should be processed much faster*  

### Using HuggingFace library
When using a custom Hugging Face model, you'll be prompted select your desired model by specifiying the model name. To do so, you'll need to navigate to https://huggingface.co/models, filter on "Token Classification" (task), "PyTorch" (libraries), and "transformers" (libraries). Select your model from the filtered model list, and copy the modelID. See Images below for further guidance - if you're not using a HuggingFace model, skip to the next step.  
**Note**: *When pasting the model ID, be sure to paste without quotes - see below image*  

![](images/HuggingFace_input_name.png)  
*Specifying Hugging Face model name*  

![](images/hugging_face_selections.png)  
*Searching and filtering for BPA compatible Hugging Face models*  

![](images/huggingFace_model_name.png)  
*Retreiving the Hugging Face model name*


  ## View Your Results
  Your results will be stored in a Cosmos database within your Azure Resource Group.  
  - Navigate to your cosmosDB in your Azure Resource Portal (which will also have the same name as your project name)  
  ![](images/navigate_to_cosmos_db.png)  
  - Navigtate to your Data Explorer
    - For help on using Azure Cosmosmos DB explorer for the first time, please see [Work with data using Azure Cosmos DB Explorer](https://docs.microsoft.com/en-us/azure/cosmos-db/data-explorer)
  - The "items" folder (image below) will contain your pipeline output 
    - You should see a container, named after your project name. Select that container  
    - You will see a SQL query, named after your project name. Select that query  
    - Within that query, Select Items. Here you should see multiple items  
      - The first item will be your pipeline metadata  
      - The second will be contain the output from your first document  
      - An additional item will be created for each uploaded document  
    ![](images/navigating_cosmos_db_explorer.png)  


If a Cognitive Search index was added to the pipeline, you will need to navigate to your newly created Cognitive Search Resource within that same Resource Group.  
![](images/cognitive_search_index1.png)  
*Generated Cognitive Search Index*  

---
## Further Customization
All code for the front end React-based UI is provided for further customization (see references for designing and customizing React apps).  

Generally, Services with text outputs (e.g. Azure Language Service, and many Services from Form Recognizer and Speech Service) will return a JSON response, where the key output is passed to the next stage of the pipeline for continued processing, or finally stored in a CosmosDB (see image below). Each of these intermediate outputs, will also be added to a Cognitive Search Index, if the feature is added to the end of the pipeline.  

Leveraging this accelerator as part of a broader pipeline is encouraged! The AI Rangers / AI Specialist CSA teams would love to hear about future use cases. See references for more contact information.

![](images/json-output.png)  

---
## Contacts
Please reach out to the AI Rangers for more info or feedback aka.ms/AIRangers

## Roadmap
| Priority | Item |
| ------- | ------------- |
| Impending | Adding instructions on basic UI customizations (e.g. adding header graphics, changing title, etc..) |
| TBD | ... |
 

## References
| Subject | Source (Link) |
| ------- | ------------- |
| React source template | This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) |
| Azure Form Recognizer |  https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/concept-model-overview |
| Azure Language Service | https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/overview |
| Azure Speech Service | https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/overview |
| Azure Cognitive Search | [https://azure.microsoft.com/en-us/services/search/](https://docs.microsoft.com/en-us/azure/search/search-what-is-azure-search) |
| HuggingFace | https://huggingface.co/models?pipeline_tag=text-classification&sort=downloads |
| Additional Model Documentation |tbd |
