# Document Processing Accelerator


## Overview

[Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/overview) allows you to easily build [React](https://reactjs.org/) apps in minutes. Use this repo with the [React quickstart](https://docs.microsoft.com/azure/static-web-apps/getting-started?tabs=react) to build and customize a new static site and automate the deployment of a functional, and customizable, POC UI for document processing. This guide will present a high-level overview of the deployment architecture, with a step-by-step instructional guide for immediate deployment, without any coding.



- [Overview](#overview)  
- [Architecture](#architecture)  
- [Currently Inluded Algorithms](#currently-inluded-algorithms)  
- [Prerequisities](#prerequisities)  
- [Installation Steps](#installation-steps)  
  - [Clone starter backend repo](#1-clone-the-starter-backend-repo)  
  - [Set Up Resource Group](#2-create-a-resource-group-in-your-azure-portal)  
  - [Set up Azure DevOps Pipeline](#3-setting-up-azure-devops-pipeline)  
    - [Navigate to Azure](#1-navigate-to-azure-devops-wwwdevazurecom)
    - [Create a New Project](#2-create-a-new-project)
    - [Select Repo](#3-select-repos-in-left-navigation-pane)  
    - [Import Repository](#4-select-import-a-repository)  
    - [Navigate to Project Settings](#5-navigate-to-project-settings)
    - [Create Service Connection](#6-create-service-connection)  
    - [Define Pipeline](#7-define-pipeline)  
    - [Clone UI Repo](#clone-ui-repo)
    - [Review your Pipeline YAML](#8--review-your-pipeline-yaml)  
- [Save and Run!](#save-and-run!)  
- [Launch App](#load-app)  
- [Load Documents!](#load-documents!)  
- [Contacts](#contacts)  
- [Roadmap](#roadmap)
- [References](#references)  
---

![](https://github.com/brandoncwn/staticwebappstarter/blob/main/images/web_app_ui3.png)


## Architecture
(James to udpate) Once you've created a high-level Resource Group, you'll create a high-level Azure DevOps pipeline and import/clone this repo, automatically importing helper libraries and taking advantage of Azure functions to deploy the set of Azure Cognitive Services and manage all of the new Azure module credentials, in the background, within your newly created pipeline. Once the pipeline is deployed, a static webapp will be created with your newly customizable POC UI for document processing!

![](https://github.com/brandoncwn/staticwebappstarter/blob/main/images/sample_architecture3.jpg)

## Currently Inluded Algorithms
The initial release includes two top NLP use cases, text classification, and custom named entity recognition. Additional tasks and models are on the roadmap for inclusion (see Roadmap section later in this document).
#### Text Classification
Text classification is a supervised learning method of learning and predicting the category or the class of a document given its text content. The state-of-the-art methods are based on neural networks of different architectures as well as pre-trained language models or word embeddings.
#### Custom Named Entity Recognition
Named Entity Recognition (NER) is the task of detecting and classifying real-world objects mentioned in text. Common named entities include person names, locations, organizations, etc. The state-of-the art NER methods include combining Long Short-Term Memory neural network with Conditional Random Field (LSTM-CRF) and pretrained language models like BERT.

NER usually involves assigning an entity label to each word in a sentence, such as the entities shown below:

O: Not an entity (i.e. All other words)  
I-LOC: Location  
I-ORG: Organization  
I-PER: Person  

There are a few standard labeling schemes and you can find the details [here](http://cs229.stanford.edu/proj2005/KrishnanGanapathy-NamedEntityRecognition.pdf). The data can also be labeled with custom entities as required by the use case.

## Prerequisities
1. Github account
2. Ensure your subscription has Microsoft.DocumentDB enabled  
To check:  
    a. Go to your subscription within portal.azure.com  
    b. Select Resource Providers at bottom of left navigation pane  
    c. Within the Filter by name menu, search for Microsoft.DocumentDB  
    d. Once Microsoft.DocumentDB is found, check if the status is marked as "Registered". If marked as "NotRegistered", Select "Register"  
    **Note**:*This process may take several seconds/minutes, be sure to refresh the entire browser periodically*
3. Ensure that you have accepted terms and conditions for Responsible AI
 "You must create your first Face, Language service, or Computer Vision resources from the Azure portal to review and acknowledge the terms and conditions. You can do so here: Face, Language service, Computer Vision. After that, you can create subsequent resources using any deployment tool (SDK, CLI, or ARM template, etc) under the same Azure subscription."

## Installation Steps
### 1. Clone the starter backend repo
Clone https://github.com/jameshoff-msft/bpa-backend to your github account  
**Note**: *a Microsoft organization github account is **not** required*
### 2. Create a Resource Group in your Azure Portal
Select your preferred Region
### 3. Setting up Azure DevOps Pipeline
**Note**: You'll use Azure DevOps for running the multi-stage pipeline with build. If you don't already have an Azure DevOps organization, create one by following the instructions at [Quickstart: Create an organization or project collection](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/create-organization?view=azure-devops).)


####    1. Navigate to Azure DevOps www.dev.azure.com
####    2. Create a new Project
Type in your Project name. And Select a Visibility setting (currently tested with Private)

![](https://github.com/brandoncwn/staticwebappstarter/blob/main/images/create_project2.png)

####     3. Select Repos in left Navigation pane
####     4. Select Import a Repository 
Select Git for Repository type. Paste the quick start repo https://github.com/jameshoff-msft/bpa-backend into the CLone URL* field. This repo is used for the POC backend, e.g. creating backend Cognitive Service, Azure functions, and managing credentials

**Note**: *You may leave Requires Authentication unchecked*  
 Cloning may take several minutes. 
 
 ![](https://github.com/brandoncwn/staticwebappstarter/blob/main/images/clone_repository_status.png)
 
 Your cloned repository should mirror the below directory:
 
 ![](https://github.com/brandoncwn/staticwebappstarter/blob/main/images/cloned_repository.png)
 
####    5. Navigate to Project Settings

 ![](https://github.com/brandoncwn/staticwebappstarter/blob/main/images/project_settings2.png)  
 
 
####     6. Create Service Connection
This Service Connection will allow Azure DevOps to manage resources within your newly created Resource Group
1. Click Service Connections in left navigation pane
2. Select Create service connection - This authorizes Azure DevOps to manage your Azure resources on your behalf.  
Select Next.
3. Select Azure Resource Manager 
    **Note**: *Service principal option is recommended*
4. Select your subscription level 
    a. Subscription level scope is recommended.  
    b. Select your Subscription.  
    c. Define Service Connection name (save the Service Connection name for reuse in the subsequent steps    
    **Note** :*Recommended all lower case alphanumeric only*  
    d. check the box for Grant access permission to all pipelines  
    
    ![](https://github.com/brandoncwn/staticwebappstarter/blob/main/images/access_permission.png)  
    
5. Input the same Resource group and Service connection name 
6. Select the checkbox for "Grant access permission to all pipelines  
       **Note** *alphanumeric lower case only as multiple azure services and resources are being used with different naming convention restrictions*
       
####     7. Define Pipeline
1. Navigate back to Pipelines in your left Navigation Pane
2. Select Create Pipeline
3. Select Azure Repos Git
4. Select your previously cloned repo

####     8. Clone UI repo
This repo is used for the POC front end.    
Fork the below repository to the same Github that was used previously
https://github.com/jameshoff-msft/staticwebappstarter

1. Ensure you are still logged into your github repo
2. Navigate to the above repo
3. Select Fork in upper right menu
4. Select your github account  
We will use the link (github.com/<my account name>/staticwebappstarter) to this newly forked repo in the next steps

####     9. Review your Pipeline YAML
We'll only need to update lines 12-17, with the following instructions instructions
1. Azure subscription = service connection previously created
2. Fill in Project name - must be unique (this name is used across most of the services created during this accelerator)
3. Fill in resource group name
4. Select your desired location
5. Select your previously cloned repo's staticwebappstarter URI.
6. Find your repository token
  i.   On your github repo page, click your profile  
  ii.  Select Settings  
  iii. Select Developer settings at bottom of left navigation pane  
  iv.  Select Personal access tokens  
  v.   Select Generate personal access token  
  vi.  Under Select scopes, select the checkbox for workflow  
  vii. Add your own description  
  viii. Select Generate token  
  ix.  Copy your newly generated token  
  **Note**: *be sure to save this token for completing pipeline setup, else this token will need to be regenerated*  
  v.   Paste your newly generated token in the repositoryToken field  
  vi.  Under Select scopes, select the checkbox for workflow  

## 4. Save and Run!
Insert any commit message. You should see the pipeline stages workflow updating. Pipeline deployment will generally take several minutes. Monitor the status of your runs: 

 ![](https://github.com/brandoncwn/staticwebappstarter/blob/main/images/model_pipeline_run_part1.png)
 
 You can drill into each stage for a more detailed log.
 
 ![](https://github.com/brandoncwn/staticwebappstarter/blob/main/images/model_pipeline_run_part1_detailed_log.png)
 
 ## 5. Launch App
1. Navigate to your Resource Group within your Azure Portal <insert static web app screenshot here>
2. Select your static webapp
3. Within the default Overview pane, Select your URL to navigate to the WebApp, this take you to the newly launched WebApp!
 
 ![](https://github.com/brandoncwn/staticwebappstarter/blob/main/images/find_static_web_app2.png)
 
 ## 6. Load Documents!
Use the Select PDF File to load your documents  
  **Note**: *your documents should be in pdf/image format. The first document loaded may take several minutes. However, all subsequent documents should be processed much faster*
 
 ![](https://github.com/brandoncwn/staticwebappstarter/blob/main/images/web_app_blank2.png)
 
 ![](https://github.com/brandoncwn/staticwebappstarter/blob/main/images/web_app_file_upload_successful.png)

Check for you newly found custom entities!
 
  ![](https://github.com/brandoncwn/staticwebappstarter/blob/main/images/web_app_ui2.png)  
  
You can further customize your UI via the front end repo https://github.com/<your github account>/staticwebappstarter. Simple instructions on how to quickly do so are coming soon

## Contacts
 Please reach out to the AI Rangers for more info or feedback aka.ms/AIRangers

## Roadmap
| Priority | Item |
| ------- | ------------- |
| Impending | Adding instructions on basic UI customizations (e.g. Adding header graphics, changing title, etc..) |
| Impending | Add standard NER capability from Language Service [What is Named Entity Recognition (NER) in Azure Cognitive Service for Language](https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/named-entity-recognition/overview#:~:text=Named%20Entity%20Recognition%20(NER)%20is,categorize%20entities%20in%20unstructured%20text.)  |
| TBD | Add text summarization |
| TBD | ... |
 

## References
| Subject | Source (Link) |
| ------- | ------------- |
| React source template | This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) |
| Custom NER |  https://github.com/microsoft/nlp-recipes/tree/master/examples/named_entity_recognition |
| Text Classification | https://github.com/microsoft/nlp-recipes/tree/master/examples/text_classification |
