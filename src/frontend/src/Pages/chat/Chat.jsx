import { useRef, useState, useEffect } from "react";
import { Panel, DefaultButton, SpinButton, TextField } from "@fluentui/react";
//import { SparkleFilled } from "@fluentui/react-icons";
import { Button, Dropdown } from '@fluentui/react-northstar';
import styles from "./Chat.module.css";



import { chatApi } from "./api";
import { Answer, AnswerError, AnswerLoading } from "./components/Answer";
import { QuestionInput } from "./components/QuestionInput";
//import { ExampleList } from "./components/Example";
import { UserChatMessage } from "./components/UserChatMessage";
import { AnalysisPanel, AnalysisPanelTabs } from "./components/AnalysisPanel";
import { SettingsButton } from "./components/SettingsButton";
import { ClearChatButton } from "./components/ClearChatButton";
import axios from 'axios'


// export const enum Approaches {
//     RetrieveThenRead = "rtr",
//     ReadRetrieveRead = "rrr",
//     ReadDecomposeAsk = "rda"
// }

const chainTypes = [
    "refine",
    "stuff",
    "map_reduce"
]

const agentTypes = [
    "plan-and-execute",
    "chat-zero-shot-react-description"
]

const processTypes = [
    {
        name: "chain",
        chainTypes: chainTypes
    },
    {
        name: "agent",
        agentTypes: agentTypes,
        chainTypes: chainTypes
    }
]

const EnterpriseSearch = () => {
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [promptTemplate, setPromptTemplate] = useState("");
    // const [facetTemplate, setFacetTemplate] = useState("If the question is asking about 'sentiment' regarding the sources and other documents in the database, use the 'Facets' field to answer the question.");
    // const [facetQueryTermsTemplate, setFacetQueryTermsTemplate] = useState("When generating the Search Query do not use terms related to sentiment.  Example ['sentiment', 'positive', 'negative',etc]");
    const [retrieveCount, setRetrieveCount] = useState(3);
    //const [useSemanticRanker, setUseSemanticRanker] = useState(true);
    // const [vectorSearchPipeline, setVectorSearchPipeline] = useState("");
    //const [useSemanticCaptions, setUseSemanticCaptions] = useState(false);
    //const [excludeCategory, setExcludeCategory] = useState("");
    //const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] = useState(false);

    const lastQuestionRef = useRef("");
    const chatMessageStreamEnd = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [activeCitation, setActiveCitation] = useState(null);
    const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] = useState(undefined);

    const [selectedAnswer, setSelectedAnswer] = useState(0);
    const [answers, setAnswers] = useState([]);

    const [indexes, setIndexes] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null)
    //const [indexSearchDone, setIndexSearchDone] = useState(false)
    // const [pipelines, setPipelines] = useState([])
    const [processType, setProcessType] = useState(processTypes[0])
    const [agentType, setAgentType] = useState(agentTypes[0])
    const [chainType, setChainType] = useState(chainTypes[0])
    const [tools, setTools] = useState([])
    const [toolName, setToolName] = useState("")
    const [toolDescription, setToolDescription] = useState("")
    const [agentMessage, setAgentMessage] = useState("I am a virtual assistant that will help you to find answers to questions.  For every reponse, include the filename that should be attributed between square brackets.  For example, \"This is the answer to your question. [directory1/filename1.pdf][directory2/filename2.pdf]\"")



    useEffect(() => {
        axios.get('/api/indexes').then(_indexes => {
            if (_indexes?.data?.indexes) {
                setIndexes(_indexes.data.indexes)
                setSelectedIndex(_indexes.data.indexes[0])
            }
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const generatePipeline = () => {
        const llmConfig = {
            temperature: 0.1,
            topP: 0,
            frequencyPenalty: 0.1,
            presencePenalty: 0,
            n: 1,
            streaming: false,
            modelName: "gpt-3.5-turbo",
            maxConcurrency: 1
        }

        let pipeline = {}


        if (processType === 'chain') {
            pipeline = {
                name: "first",
                type: "chain",
                subType: "RetrievalQA",
                chainParameters: {
                    type: chainType,
                    agentMessage: agentMessage,
                    memorySize: 10,
                    llmConfig: llmConfig,
                    retriever: {
                        type: "cogsearch",
                        indexConfig: selectedIndex,
                        numDocs: retrieveCount
                    }
                }
            }
        } else {
            pipeline = {
                name: "agent",
                type: "agent",
                subType: agentType,
                parameters: {
                    tools: tools,
                }
            }

        }
        return pipeline
    }


    const onIndexChange = (_, value) => {
        if (indexes && indexes.length > 0) {
            const _index = indexes.find(i => i.name === value.value)
            setSelectedIndex(_index)
        }

    }

    const onProcessChange = (_, value) => {
        setProcessType(value.value)
    }

    const onChainChange = (_, value) => {
        setChainType(value.value)
    }

    const onAgentChange = (_, value) => {
        setAgentType(value.value)
    }

    const onChangeToolName = (_, value) => {
        setToolName(value)
    }

    const onChangeToolDescription = (_, value) => {
        setToolDescription(value)
    }

    const onChangeAgentMessage = (_, value) => {
        setAgentMessage(value)
    }

    const onAddTool = () => {
        const llmConfig = {
            temperature: 0.1,
            topP: 0,
            frequencyPenalty: 0.1,
            presencePenalty: 0,
            n: 1,
            streaming: false,
            modelName: "gpt-3.5-turbo",
            maxConcurrency: 1
        }

        const newTool = {
            name: toolName,
            description: toolDescription,
            agentMessage: agentMessage,
            memorySize: 10,
            chainParameters: {
                type: chainType,
                llmConfig: llmConfig,
                retriever: {
                    type: "cogsearch",
                    indexConfig: selectedIndex,
                    numDocs: retrieveCount
                }
            }
        }
        const _tools = []
        for(const t of tools){
            _tools.push(t)
        }
        _tools.push(newTool)
        setTools(_tools)
    }

    const makeApiRequest = (question => {
        lastQuestionRef.current = question;

        error && setError(undefined);
        setIsLoading(true);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);

        try {
            const history = answers.map(a => ({ user: a[0], assistant: a[1].answer }));
            const request = {
                history: [...history, { user: question, assistant: undefined }],
                approach: "rtr", //Approaches.ReadRetrieveRead,
                pipeline: generatePipeline(),
                overrides: {
                    //promptTemplate: promptTemplate.length === 0 ? undefined : promptTemplate,
                    //excludeCategory: excludeCategory.length === 0 ? undefined : excludeCategory,
                    top: retrieveCount,
                    //semanticRanker: useSemanticRanker,
                    //vectorSearchPipeline: vectorSearchPipeline,
                    //semanticCaptions: useSemanticCaptions,
                    //suggestFollowupQuestions: useSuggestFollowupQuestions,
                    //facetQueryTermsTemplate: facetQueryTermsTemplate,
                    //facetTemplate : facetTemplate
                },
                index: selectedIndex
            };
            chatApi(request).then(result => {
                setAnswers([...answers, [question, result]]);
                setIsLoading(false);
            })

        } catch (e) {
            setError(e);
        } finally {
            //setIsLoading(false);
        }
    });

    const onPromptTemplateChange = () => {

    }

    const clearChat = () => {
        lastQuestionRef.current = "";
        error && setError(undefined);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);
        setAnswers([]);
    };

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [isLoading]);

    const onRetrieveCountChange = (_ev, newValue) => {
        setRetrieveCount(parseInt(newValue || "3"));
    };

    const onShowCitation = (citation, index) => {
        if (activeCitation === citation && activeAnalysisPanelTab === AnalysisPanelTabs.CitationTab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveCitation(citation);
            setActiveAnalysisPanelTab(AnalysisPanelTabs.CitationTab);
        }

        setSelectedAnswer(index);
    };

    const onToggleTab = (tab, index) => {
        if (activeAnalysisPanelTab === tab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveAnalysisPanelTab(tab);
        }

        setSelectedAnswer(index);
    };

    // const onVectorSearchPipeline = (_ev, newValue) => {
    //     setVectorSearchPipeline(newValue.value)
    // }

    return (
        <div className={styles.container}>

            <div className={styles.commandsContainer}>
                <ClearChatButton className={styles.commandButton} onClick={clearChat} disabled={!lastQuestionRef.current || isLoading} />
                <SettingsButton className={styles.commandButton} onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)} />
                <div style={{ marginRight: "10px" }}>

                    <Dropdown
                        placeholder="Select the Process Type"
                        label="Process Type"
                        items={processTypes.map(p => p.name)}
                        onChange={onProcessChange}
                        style={{ marginBottom: "20px" }}

                    />
                    <Dropdown
                        placeholder="Select the Agent Type"
                        label="Agent Type"
                        items={agentTypes}
                        onChange={onAgentChange}
                        disabled={processType !== 'agent'}
                        style={{ marginBottom: "20px" }}

                    />
                    <TextField
                        className={styles.chatSettingsSeparator}
                        value={toolName}
                        label="Tool Name: "
                        multiline
                        autoAdjustHeight
                        onChange={onChangeToolName}
                        disabled={processType !== 'agent'}
                        style={{ marginBottom: "20px" }}
                    />
                    <TextField
                        className={styles.chatSettingsSeparator}
                        value={toolDescription}
                        label="Tool Description: "
                        multiline
                        autoAdjustHeight
                        onChange={onChangeToolDescription}
                        disabled={processType !== 'agent'}
                        style={{ marginBottom: "20px" }}
                    />
                    <TextField
                        className={styles.chatSettingsSeparator}
                        value={agentMessage}
                        label="Agent Message: "
                        multiline
                        autoAdjustHeight
                        onChange={onChangeAgentMessage}
                        disabled={processType !== 'agent'}
                        style={{ marginBottom: "20px" }}
                    />
                    <Dropdown
                        placeholder="Select the Chain Type"
                        label="Chain Type"
                        items={chainTypes}
                        onChange={onChainChange}
                        style={{ marginBottom: "20px" }}
                    />

                    <Dropdown
                        placeholder="Select the Cognitive Search Index"
                        label="Output"
                        items={indexes.map(sc => sc.name)}
                        onChange={onIndexChange}
                        style={{ marginBottom: "20px" }}
                    />

                    <Button primary content="Add Tool"
                        style={{ marginBottom: "20px" }}
                        disabled={processType !== 'agent'}
                        onClick={onAddTool}
                    />

                </div>
                {/* <div>
                    <Dropdown
                        search
                        placeholder="Select the Vector Embedding Index"
                        label="Output"
                        items={pipelines.map(sc => sc.name)}
                        onChange={onVectorSearchPipeline}
                    />
                </div> */}

            </div>
            <div className={styles.chatRoot}>

                <div className={styles.chatContainer}>
                    {!lastQuestionRef.current ? (
                        <div className={styles.chatEmptyState}>
                            {/* <SparkleFilled fontSize={"120px"} primaryFill={"rgba(115, 118, 225, 1)"} aria-hidden="true" aria-label="Chat logo" /> */}
                            <h1 className={styles.chatEmptyStateTitle}>Chat with your data</h1>
                            {/* <h2 className={styles.chatEmptyStateSubtitle}>Ask anything or try an example</h2>
                            <ExampleList onExampleClicked={onExampleClicked} /> */}
                        </div>
                    ) : (
                        <div className={styles.chatMessageStream}>
                            {answers.map((answer, index) => (
                                <div key={index}>
                                    <UserChatMessage message={answer[0]} />
                                    <div className={styles.chatMessageGpt}>
                                        <Answer
                                            key={index}
                                            answer={answer[1]}
                                            isSelected={selectedAnswer === index && activeAnalysisPanelTab !== undefined}
                                            onCitationClicked={c => onShowCitation(c, index)}
                                            onThoughtProcessClicked={() => onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)}
                                            onSupportingContentClicked={() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                                            onFollowupQuestionClicked={q => makeApiRequest(q)}
                                        //showFollowupQuestions={useSuggestFollowupQuestions && answers.length - 1 === index}
                                        />
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <>
                                    <UserChatMessage message={lastQuestionRef.current} />
                                    <div className={styles.chatMessageGptMinWidth}>
                                        <AnswerLoading />
                                    </div>
                                </>
                            )}
                            {error ? (
                                <>
                                    <UserChatMessage message={lastQuestionRef.current} />
                                    <div className={styles.chatMessageGptMinWidth}>
                                        <AnswerError error={error.toString()} onRetry={() => makeApiRequest(lastQuestionRef.current)} />
                                    </div>
                                </>
                            ) : null}
                            <div ref={chatMessageStreamEnd} />
                        </div>
                    )}

                    <div className={styles.chatInput}>
                        <QuestionInput
                            clearOnSend
                            placeholder="Type a new question"
                            disabled={isLoading}
                            onSend={question => makeApiRequest(question)}
                        />
                    </div>
                </div>

                {answers.length > 0 && activeAnalysisPanelTab && (
                    <AnalysisPanel
                        className={styles.chatAnalysisPanel}
                        activeCitation={activeCitation}
                        onActiveTabChanged={x => onToggleTab(x, selectedAnswer)}
                        citationHeight="810px"
                        answer={answers[selectedAnswer][1]}
                        activeTab={activeAnalysisPanelTab}
                        selectedIndex={selectedIndex}
                    />
                )}

                <Panel
                    headerText="Configure answer generation"
                    isOpen={isConfigPanelOpen}
                    isBlocking={false}
                    onDismiss={() => setIsConfigPanelOpen(false)}
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={() => <DefaultButton onClick={() => setIsConfigPanelOpen(false)}>Close</DefaultButton>}
                    isFooterAtBottom={true}
                >
                    {/* <TextField
                        className={styles.chatSettingsSeparator}
                        defaultValue={promptTemplate}
                        label="Override prompt template"
                        multiline
                        autoAdjustHeight
                        onChange={onPromptTemplateChange}
                    /> */}

                    {/* <TextField
                        className={styles.chatSettingsSeparator}
                        defaultValue={facetTemplate}
                        label="Facet Template"
                        multiline
                        autoAdjustHeight
                        onChange={onFacetTemplateChange}
                    /> */}

                    {/* <TextField
                        className={styles.chatSettingsSeparator}
                        defaultValue={facetQueryTermsTemplate}
                        label="Facet Query Terms Template"
                        multiline
                        autoAdjustHeight
                        onChange={onFacetQueryTermsTemplateChange}
                    /> */}

                    <SpinButton
                        className={styles.chatSettingsSeparator}
                        label="Retrieve this many documents from search:"
                        min={1}
                        max={50}
                        defaultValue={retrieveCount.toString()}
                        onChange={onRetrieveCountChange}
                    />
                    {/* <TextField className={styles.chatSettingsSeparator} label="Exclude category" onChange={onExcludeCategoryChanged} />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticRanker}
                        label="Use semantic ranker for retrieval"
                        onChange={onUseSemanticRankerChange}
                    />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticCaptions}
                        label="Use query-contextual summaries instead of whole documents"
                        onChange={onUseSemanticCaptionsChange}
                        disabled={!useSemanticRanker}
                    />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSuggestFollowupQuestions}
                        label="Suggest follow-up questions"
                        onChange={onUseSuggestFollowupQuestionsChange}
                    /> */}
                    {/* <TextField className={styles.chatSettingsSeparator} label="Vector Search Index" onChange={onVectorSearchPipeline} /> */}
                </Panel>
            </div>
        </div>
    );
};

export default EnterpriseSearch;
