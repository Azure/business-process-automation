export const agentPayload = {
    "history": [
        {
            "user": "show me hotels near wilmington beach"
        }
    ],
    "approach": "rtr",
    "index": {
        "name": "hotels-flat-index",
        "facetableFields": [],
        "searchableFields": [
            "shortDescription",
            "longDescription",
            "state",
            "zip",
            "petPolicy",
            "parking",
            "hotelMajorFeature",
            "mustDo",
            "mustSee",
            "whatsNew"
        ],
        "collections": [],
        "semanticConfigurations": [
            {
                "name": "default",
                "prioritizedFields": {
                    "titleField": {
                        "fieldName": "profile/name"
                    },
                    "prioritizedContentFields": [
                        {
                            "fieldName": "profile/shortDescription"
                        },
                        {
                            "fieldName": "profile/longDescription"
                        },
                        {
                            "fieldName": "address/state/name"
                        },
                        {
                            "fieldName": "address/zip"
                        },
                        {
                            "fieldName": "policies/pet/description"
                        },
                        {
                            "fieldName": "parking/parkingDescription"
                        },
                        {
                            "fieldName": "marketing/marketingText/hotelMajorFeature"
                        },
                        {
                            "fieldName": "marketing/marketingText/mustDo"
                        },
                        {
                            "fieldName": "marketing/marketingText/mustSee"
                        },
                        {
                            "fieldName": "marketing/marketingText/whatsNew"
                        }
                    ],
                    "prioritizedKeywordsFields": []
                }
            }
        ]
    },
    "pipeline": {
        "name": "agent",
        "type": "agent",
        "subType": "plan-and-execute",
        "prompt": "Based on the Question and Completed Steps return one of the following: [completed, search_hotels, hotel_information, completed]\n\n    Rules:\n    \n    - if the question is not about hotels, hotel locations, events near a hotel, or information about a hotel, return not_in_scope.\n    \n    - if a list of hotels exists in the Completed Steps, return completed\n    \n    - if there is not a list of hotels in the Completed Steps, return search_hotels\n    \n    - if the question is asking for additional information about a group of hotels and the hotels exist in the Completed Steps, return hotel_information\n    \n    Examples:\n    \n         Question: \"show me hotels near raleigh, nc\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: completed<stop>\n    \n         Question: \"show me hotels near raleigh, nc\" \n         Completed Steps: \n        Result: search_hotels<stop>\n    \n         Question: \"what is the parking policy?\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: hotel_information<stop>\n    \n         Question: \"is wifi available?\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: hotel_information<stop>\n    \n        Question: \"is wifi available?\" \n         Completed Steps: \n        Result: search_hotels<stop>\n    \n         Question: \"i need some hotels near Pittsburgh that have ample parking\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n    \n             Information:\n             - Linyi West : Parking is not \n\nQuestion: \"what is the pet policy?\"\n    \n         Completed Steps:\n         \nshow me hotels near raleigh\n\nHotels: \n\t- Name: Linyi West \n\t- Name: Danville \n\t- Name: Charlotte NE - University Area \n\n\nwhat is the pet policy?\n\nSomething went wrong. AbortError\n\n         \nInformation: \n\n\t- Linyi West : No pets are allowed.\n\n\n\t- Danville : Pets are allowed with a non-refundable fee of $75 per stay. The limit is 2 pets per pet-friendly room with a weight limit of 50 lbs. Pets are not allowed in the breakfast area.\n\n\n\t- Charlotte NE - University Area : The document does not provide information about the pet policy.\n\n\n\n    \n         Result: completed<stop>\n\n\n             - Danville : There is no mention of parking in the document\n             - Charlotte NE - University Area : There is no mention of parking in the document\n        Result: completed<stop>\n    \n         Question: \"what is the pet policy for hotels near raleigh\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n    \n             Information:\n             - Linyi West : Service pets are welcome.\n             - Danville : There is no mention of pets in the document\n             - Charlotte NE - University Area : There is no mention of petsin the document\n        Result: completed<stop>\n    \n    Question: \"what is the parking policy?\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: hotel_information<stop>\n    \n         Question: \"what are the pet policies for hotels near austin, tx\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: hotel_information<stop>\n\n\n\n    \n         Question: \"what are the pet policies for hotels near austin, tx\" \n         Completed Steps: \n        Result: search_hotels<stop>\n    \n    \n         Question: \"is a cat a mammal?\" \n         Completed Steps: \n        Result: not_in_scope<stop>\n    \n    \n         Question: \"i need a hotel near disney world with ample parking.\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: hotel_information<stop>\n    \n         Question: \"my cousin needs to borrow money\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Information:\n             - Linyi West : Parking is not available\n             - Danville : There is no mention of parking in the document\n             - Charlotte NE - University Area : There is no mention of parking in the document\n        Result:  not_in_scope\n\n        Question: \"what is the pet policy?\"\n    \n        Completed Steps:\n         \n        show me some hotels near raleigh\n\n         Hotels: \n\t- Name: Linyi West \n        - Name: Linyi Riverside \n\n        Result: hotel_information<stop>\n\n\tQuestion: \"what is the pet policy?\"\n    \n         Completed Steps:\n         \n\tshow me hotels close to raleigh\n\n\tHotels: \n\t- Name: Linyi West \n\t- Name: Linyi Riverside \n\n\n         \n\tInformation: \n\n\t- Linyi West : No pets allowed.\n\n\n\t- Linyi Riverside : The pet policy is that pets are not allowed unless they are service animals.\n\n\n\n    \n         Result: completed<stop>\n\n    \n    \n         Question: \"{input}\"\n    \n         Completed Steps:\n         {history}\n         {steps}\n    \n         Result:",
        "parameters": {
            "tools": [
                {
                    "name": "search_hotels",
                    "description": "Search for hotels based on location.  Use this tool if it is a list of hotels is not available in the Question or Completed Steps.",
                    "memorySize": 10,
                    "chainParameters": {
                        "type": "geolocation",
                        "memorySize": 10,
                        "llmConfig": {
                            "temperature": 0.1,
                            "topP": 1,
                            "frequencyPenalty": 0.1,
                            "presencePenalty": 0,
                            "n": 1,
                            "streaming": false,
                            "modelName": "gpt-3.5-turbo-16k",
                            "maxConcurrency": 1
                        },
                        "retriever": {
                            "type": "cogsearch",
                            "indexConfig": {
                                "name": "hotels-flat-index",
                                "facetableFields": [],
                                "searchableFields": [
                                    "shortDescription",
                                    "longDescription",
                                    "state",
                                    "zip",
                                    "petPolicy",
                                    "parking",
                                    "hotelMajorFeature",
                                    "mustDo",
                                    "mustSee",
                                    "whatsNew"
                                ],
                                "collections": [],
                                "semanticConfigurations": [
                                    {
                                        "name": "default",
                                        "prioritizedFields": {
                                            "titleField": {
                                                "fieldName": "profile/name"
                                            },
                                            "prioritizedContentFields": [
                                                {
                                                    "fieldName": "profile/shortDescription"
                                                },
                                                {
                                                    "fieldName": "profile/longDescription"
                                                },
                                                {
                                                    "fieldName": "address/state/name"
                                                },
                                                {
                                                    "fieldName": "address/zip"
                                                },
                                                {
                                                    "fieldName": "policies/pet/description"
                                                },
                                                {
                                                    "fieldName": "parking/parkingDescription"
                                                },
                                                {
                                                    "fieldName": "marketing/marketingText/hotelMajorFeature"
                                                },
                                                {
                                                    "fieldName": "marketing/marketingText/mustDo"
                                                },
                                                {
                                                    "fieldName": "marketing/marketingText/mustSee"
                                                },
                                                {
                                                    "fieldName": "marketing/marketingText/whatsNew"
                                                }
                                            ],
                                            "prioritizedKeywordsFields": []
                                        }
                                    }
                                ]
                            },
                            "numDocs": 3
                        },
                        "stuffPrompt": "Based on the Question and Completed Steps return one of the following: [completed, search_hotels, hotel_information, completed]\n\n    Rules:\n    \n    - if the question is not about hotels, hotel locations, events near a hotel, or information about a hotel, return not_in_scope.\n    \n    - if a list of hotels exists in the Completed Steps, return completed\n    \n    - if there is not a list of hotels in the Completed Steps, return search_hotels\n    \n    - if the question is asking for additional information about a group of hotels and the hotels exist in the Completed Steps, return hotel_information\n    \n    Examples:\n    \n         Question: \"show me hotels near raleigh, nc\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: completed<stop>\n    \n         Question: \"show me hotels near raleigh, nc\" \n         Completed Steps: \n        Result: search_hotels<stop>\n    \n         Question: \"what is the parking policy?\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: hotel_information<stop>\n    \n         Question: \"is wifi available?\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: hotel_information<stop>\n    \n        Question: \"is wifi available?\" \n         Completed Steps: \n        Result: search_hotels<stop>\n    \n         Question: \"i need some hotels near Pittsburgh that have ample parking\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n    \n             Information:\n             - Linyi West : Parking is not \n\nQuestion: \"what is the pet policy?\"\n    \n         Completed Steps:\n         \nshow me hotels near raleigh\n\nHotels: \n\t- Name: Linyi West \n\t- Name: Danville \n\t- Name: Charlotte NE - University Area \n\n\nwhat is the pet policy?\n\nSomething went wrong. AbortError\n\n         \nInformation: \n\n\t- Linyi West : No pets are allowed.\n\n\n\t- Danville : Pets are allowed with a non-refundable fee of $75 per stay. The limit is 2 pets per pet-friendly room with a weight limit of 50 lbs. Pets are not allowed in the breakfast area.\n\n\n\t- Charlotte NE - University Area : The document does not provide information about the pet policy.\n\n\n\n    \n         Result: completed<stop>\n\n\n             - Danville : There is no mention of parking in the document\n             - Charlotte NE - University Area : There is no mention of parking in the document\n        Result: completed<stop>\n    \n         Question: \"what is the pet policy for hotels near raleigh\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n    \n             Information:\n             - Linyi West : Service pets are welcome.\n             - Danville : There is no mention of pets in the document\n             - Charlotte NE - University Area : There is no mention of petsin the document\n        Result: completed<stop>\n    \n    Question: \"what is the parking policy?\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: hotel_information<stop>\n    \n         Question: \"what are the pet policies for hotels near austin, tx\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: hotel_information<stop>\n\n\n\n    \n         Question: \"what are the pet policies for hotels near austin, tx\" \n         Completed Steps: \n        Result: search_hotels<stop>\n    \n    \n         Question: \"is a cat a mammal?\" \n         Completed Steps: \n        Result: not_in_scope<stop>\n    \n    \n         Question: \"i need a hotel near disney world with ample parking.\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: hotel_information<stop>\n    \n         Question: \"my cousin needs to borrow money\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Information:\n             - Linyi West : Parking is not available\n             - Danville : There is no mention of parking in the document\n             - Charlotte NE - University Area : There is no mention of parking in the document\n        Result:  not_in_scope\n\n        Question: \"what is the pet policy?\"\n    \n        Completed Steps:\n         \n        show me some hotels near raleigh\n\n         Hotels: \n\t- Name: Linyi West \n        - Name: Linyi Riverside \n\n        Result: hotel_information<stop>\n\n\tQuestion: \"what is the pet policy?\"\n    \n         Completed Steps:\n         \n\tshow me hotels close to raleigh\n\n\tHotels: \n\t- Name: Linyi West \n\t- Name: Linyi Riverside \n\n\n         \n\tInformation: \n\n\t- Linyi West : No pets allowed.\n\n\n\t- Linyi Riverside : The pet policy is that pets are not allowed unless they are service animals.\n\n\n\n    \n         Result: completed<stop>\n\n    \n    \n         Question: \"{input}\"\n    \n         Completed Steps:\n         {history}\n         {steps}\n    \n         Result:",
                        "refinePrompt": "\n    Question: {question}\n        Chat History:{chat_history}\n        Document: {context} \n        Existing Answer: {existing_answer}\n        Each document contains information for a single hotel.  If the information is relevant to the question and chat history, refine the existing answer. Only update the existing answer with information from the document.",
                        "refineQuestionPrompt": "Based on the chat history and question, create a new query.\n    Question: {question}\n    Chat History: {chat_history}\n    New Query:",
                        "mrCombineMapPrompt": "I'm a virtual assistant that answers questions based on documents that are returned.  I will only information that is within the context of the document.\n    Document : {context} \n    Question : {question}\n    Chat History: {chat_history}\n    Answer:",
                        "mrCombinePrompt": "I'm a virtual assistant that answers questions based on documents that are returned.  I will only information that is within the context of the document.\n    Document : {summaries} \n    Question : {question}\n    Chat History: {chat_history}\n    Answer:",
                        "questionGenerationPrompt": "Based on the chat history and question, create a new query.  Convert state abbreviations to the full form.  Example: PA to Pennsylvania.\n    Question: {question}\n    Chat History: {chat_history}\n    New Query:"
                    }
                },
                {
                    "name": "hotel_information",
                    "description": "Answer questions about hotels.  A list of hotels is required in the Completed Steps to use this tool.  If there is a hotel_questions output in the Completed Steps, return \"completed\"",
                    "memorySize": 10,
                    "chainParameters": {
                        "type": "hotelqa",
                        "memorySize": 10,
                        "llmConfig": {
                            "temperature": 0.1,
                            "topP": 1,
                            "frequencyPenalty": 0.1,
                            "presencePenalty": 0,
                            "n": 1,
                            "streaming": false,
                            "modelName": "gpt-3.5-turbo-16k",
                            "maxConcurrency": 1
                        },
                        "retriever": {
                            "type": "cogsearch",
                            "indexConfig": {
                                "name": "hotels-flat-index",
                                "facetableFields": [],
                                "searchableFields": [
                                    "profile/shortDescription",
                                    "profile/longDescription",
                                    "address/state/name",
                                    "address/zip",
                                    "policies/pet/description",
                                    "parking/parkingDescription",
                                    "marketing/marketingText/hotelMajorFeature",
                                    "marketing/marketingText/mustDo",
                                    "marketing/marketingText/mustSee",
                                    "marketing/marketingText/whatsNew",
                                    "marketing/welcomeMessage",
                                    "location/introText"
                                ],
                                "collections": [],
                                "semanticConfigurations": [
                                    {
                                        "name": "default",
                                        "prioritizedFields": {
                                            "titleField": {
                                                "fieldName": "profile/name"
                                            },
                                            "prioritizedContentFields": [
                                                {
                                                    "fieldName": "profile/shortDescription"
                                                },
                                                {
                                                    "fieldName": "profile/longDescription"
                                                },
                                                {
                                                    "fieldName": "address/state/name"
                                                },
                                                {
                                                    "fieldName": "address/zip"
                                                },
                                                {
                                                    "fieldName": "policies/pet/description"
                                                },
                                                {
                                                    "fieldName": "parking/parkingDescription"
                                                },
                                                {
                                                    "fieldName": "marketing/marketingText/hotelMajorFeature"
                                                },
                                                {
                                                    "fieldName": "marketing/marketingText/mustDo"
                                                },
                                                {
                                                    "fieldName": "marketing/marketingText/mustSee"
                                                },
                                                {
                                                    "fieldName": "marketing/marketingText/whatsNew"
                                                }
                                            ],
                                            "prioritizedKeywordsFields": []
                                        }
                                    }
                                ]
                            },
                            "numDocs": 3
                        },
                        "stuffPrompt": "Based on the Question and Completed Steps return one of the following: [completed, search_hotels, hotel_information, completed]\n\n    Rules:\n    \n    - if the question is not about hotels, hotel locations, events near a hotel, or information about a hotel, return not_in_scope.\n    \n    - if a list of hotels exists in the Completed Steps, return completed\n    \n    - if there is not a list of hotels in the Completed Steps, return search_hotels\n    \n    - if the question is asking for additional information about a group of hotels and the hotels exist in the Completed Steps, return hotel_information\n    \n    Examples:\n    \n         Question: \"show me hotels near raleigh, nc\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: completed<stop>\n    \n         Question: \"show me hotels near raleigh, nc\" \n         Completed Steps: \n        Result: search_hotels<stop>\n    \n         Question: \"what is the parking policy?\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: hotel_information<stop>\n    \n         Question: \"is wifi available?\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: hotel_information<stop>\n    \n        Question: \"is wifi available?\" \n         Completed Steps: \n        Result: search_hotels<stop>\n    \n         Question: \"i need some hotels near Pittsburgh that have ample parking\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n    \n             Information:\n             - Linyi West : Parking is not \n\nQuestion: \"what is the pet policy?\"\n    \n         Completed Steps:\n         \nshow me hotels near raleigh\n\nHotels: \n\t- Name: Linyi West \n\t- Name: Danville \n\t- Name: Charlotte NE - University Area \n\n\nwhat is the pet policy?\n\nSomething went wrong. AbortError\n\n         \nInformation: \n\n\t- Linyi West : No pets are allowed.\n\n\n\t- Danville : Pets are allowed with a non-refundable fee of $75 per stay. The limit is 2 pets per pet-friendly room with a weight limit of 50 lbs. Pets are not allowed in the breakfast area.\n\n\n\t- Charlotte NE - University Area : The document does not provide information about the pet policy.\n\n\n\n    \n         Result: completed<stop>\n\n\n             - Danville : There is no mention of parking in the document\n             - Charlotte NE - University Area : There is no mention of parking in the document\n        Result: completed<stop>\n    \n         Question: \"what is the pet policy for hotels near raleigh\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n    \n             Information:\n             - Linyi West : Service pets are welcome.\n             - Danville : There is no mention of pets in the document\n             - Charlotte NE - University Area : There is no mention of petsin the document\n        Result: completed<stop>\n    \n    Question: \"what is the parking policy?\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: hotel_information<stop>\n    \n         Question: \"what are the pet policies for hotels near austin, tx\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: hotel_information<stop>\n\n\n\n    \n         Question: \"what are the pet policies for hotels near austin, tx\" \n         Completed Steps: \n        Result: search_hotels<stop>\n    \n    \n         Question: \"is a cat a mammal?\" \n         Completed Steps: \n        Result: not_in_scope<stop>\n    \n    \n         Question: \"i need a hotel near disney world with ample parking.\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Result: hotel_information<stop>\n    \n         Question: \"my cousin needs to borrow money\" \n         Completed Steps: Hotels: \n        - Name: Linyi West \n        - Name: Danville \n        - Name: Charlotte NE - University Area \n        Information:\n             - Linyi West : Parking is not available\n             - Danville : There is no mention of parking in the document\n             - Charlotte NE - University Area : There is no mention of parking in the document\n        Result:  not_in_scope\n\n        Question: \"what is the pet policy?\"\n    \n        Completed Steps:\n         \n        show me some hotels near raleigh\n\n         Hotels: \n\t- Name: Linyi West \n        - Name: Linyi Riverside \n\n        Result: hotel_information<stop>\n\n\tQuestion: \"what is the pet policy?\"\n    \n         Completed Steps:\n         \n\tshow me hotels close to raleigh\n\n\tHotels: \n\t- Name: Linyi West \n\t- Name: Linyi Riverside \n\n\n         \n\tInformation: \n\n\t- Linyi West : No pets allowed.\n\n\n\t- Linyi Riverside : The pet policy is that pets are not allowed unless they are service animals.\n\n\n\n    \n         Result: completed<stop>\n\n    \n    \n         Question: \"{input}\"\n    \n         Completed Steps:\n         {history}\n         {steps}\n    \n         Result:",
                        "refinePrompt": "\n    Question: {question}\n        Chat History:{chat_history}\n        Document: {context} \n        Existing Answer: {existing_answer}\n        Each document contains information for a single hotel.  If the information is relevant to the question and chat history, refine the existing answer. Only update the existing answer with information from the document.",
                        "refineQuestionPrompt": "Based on the chat history and question, create a new query.\n    Question: {question}\n    Chat History: {chat_history}\n    New Query:",
                        "mrCombineMapPrompt": "I'm a virtual assistant that answers questions based on documents that are returned.  I will only information that is within the context of the document.\n    Document : {context} \n    Question : {question}\n    Chat History: {chat_history}\n    Answer:",
                        "mrCombinePrompt": "I'm a virtual assistant that answers questions based on documents that are returned.  I will only information that is within the context of the document.\n    Document : {summaries} \n    Question : {question}\n    Chat History: {chat_history}\n    Answer:",
                        "questionGenerationPrompt": "Based on the chat history and question, create a new query.  Convert state abbreviations to the full form.  Example: PA to Pennsylvania.\n    Question: {question}\n    Chat History: {chat_history}\n    New Query:"
                    }
                }
            ]
        }
    },
    "overrides": {
        "top": 3
    }
}