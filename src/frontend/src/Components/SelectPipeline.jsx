import axios from "axios"
import { useEffect, useState } from "react"
import { Text, Button, Input, Skeleton } from '@fluentui/react-northstar';
import Stages from '../Pages/Stages'
import { DeleteOutline } from '@material-ui/icons';


const pipelinesLabel = "pipelines"

const getStage1 = (name) => {
    return {
        "stages": [
            {
                "bpaServiceId": "abc123",
                "inputTypes": [
                    "pdf"
                ],
                "outputTypes": [
                    "splitPdf"
                ],
                "image": "/static/media/pdf.690dd270a8449242aab09f407a092953.svg",
                "label": "Split PDF By Page",
                "name": "splitPdf",
                "serviceSpecificConfig": {
                    "containerName": "documents",
                    "folderName": name + "-stage2"
                },
                "serviceSpecificConfigDefaults": {}
            }
        ],
        "name": name + "-stage1",
        "firstStage": {
            "bpaServiceId": "abc123",
            "inputTypes": [
                "start"
            ],
            "outputTypes": [
                "pdf"
            ],
            "image": "/static/media/pdf.690dd270a8449242aab09f407a092953.svg",
            "label": "PDF Document",
            "name": "pdf",
            "serviceSpecificConfig": {},
            "serviceSpecificConfigDefaults": {}
        }
    }
}


const getStage2 = (name) => {
    return {
        "stages": [
            {
                "filters": [
                    {
                        "key": "serviceName",
                        "value": "Cognitive Services"
                    },
                    {
                        "key": "productName",
                        "value": "Computer Vision"
                    }
                ],
                "defaultTier": "S1 Transactions",
                "bpaServiceId": "abc123",
                "inputTypes": [
                    "pdf",
                    "tiff",
                    "gif",
                    "jpg",
                    "jpeg",
                    "doc",
                    "docx",
                    "ppt",
                    "pptx"
                ],
                "outputTypes": [
                    "ocr"
                ],
                "image": "/static/media/ocrLogo.c0fa550e7948187da23780464d0c9eef.svg",
                "label": "Optical Character Recognition (OCR) Service (Batch Mode)",
                "name": "ocrBatch",
                "serviceSpecificConfig": {},
                "serviceSpecificConfigDefaults": {}
            },
            {
                "bpaServiceId": "abc123",
                "inputTypes": [
                    "ocr",
                    "text"
                ],
                "outputTypes": [
                    "textSegmentation"
                ],
                "image": "/static/media/summarizationDemoLogo.6be2f50cced4b577d54c1bc37fdb210c.svg",
                "label": "Convert Text Output To Segmented Chunks",
                "name": "textSegmentation",
                "serviceSpecificConfig": {
                    "containerName": "documents",
                    "folderName": name + "-stage3",
                    "maxSegment": "800"
                },
                "serviceSpecificConfigDefaults": {}
            }
        ],
        "name": name + "-stage2",
        "firstStage": {
            "bpaServiceId": "abc123",
            "inputTypes": [
                "start"
            ],
            "outputTypes": [
                "pdf"
            ],
            "image": "/static/media/pdf.690dd270a8449242aab09f407a092953.svg",
            "label": "PDF Document",
            "name": "pdf",
            "serviceSpecificConfig": {},
            "serviceSpecificConfigDefaults": {}
        }
    }
}
const getStage3 = (name) => {
    return {
        "stages": [
            {
                "bpaServiceId": "abc123",
                "inputTypes": [
                    "text"
                ],
                "outputTypes": [
                    "openaiEmbeddings"
                ],
                "image": "/static/media/openai.5d3eeb2cc1503bcd4cd9dce8c1876916.svg",
                "label": "OpenAI (Embeddings)",
                "name": "openaiEmbeddings",
                "serviceSpecificConfig": {},
                "serviceSpecificConfigDefaults": {}
            }
        ],
        "name": name + "-stage3",
        "firstStage": {
            "bpaServiceId": "abc123",
            "inputTypes": [
                "start"
            ],
            "outputTypes": [
                "text"
            ],
            "image": "/static/media/summarizationDemoLogo.6be2f50cced4b577d54c1bc37fdb210c.svg",
            "label": "TXT Document",
            "name": "txt",
            "serviceSpecificConfig": {},
            "serviceSpecificConfigDefaults": {}
        }
    }
}

const getCogStage3 = (name) => {
    return {
        "stages": [
           
        ],
        "name": name + "-stage3",
        "firstStage": {
            "bpaServiceId": "abc123",
            "inputTypes": [
                "start"
            ],
            "outputTypes": [
                "text"
            ],
            "image": "/static/media/summarizationDemoLogo.6be2f50cced4b577d54c1bc37fdb210c.svg",
            "label": "TXT Document",
            "name": "txt",
            "serviceSpecificConfig": {},
            "serviceSpecificConfigDefaults": {}
        }
    }
}


export default function SelectPipeline(props) {

    const [pipelines, setPipelines] = useState(null)
    const [newPipelineName, setNewPipelineName] = useState("")
    const [selectedPipeline, setSelectedPipeline] = useState(null)
    const [buttonsDisabled, setButtonsDisabled] = useState(true)
    //const [forceUpdate, setForceUpdate] = useState(0)

    useEffect(() => {
        try {
            axios.get(`/api/config?id=${pipelinesLabel}`).then(ret => {
                if (ret.data === '') {
                    setPipelines([])
                } else {
                    setPipelines(ret.data.pipelines)
                }

            })
        } catch (err) {
            console.log(err)
        }
    }, [])

    const onPipelineNameChange = (event) => {
        setNewPipelineName(event.target.value)
        if(event.target.value.length > 2){
            setButtonsDisabled(false)
        } else{
            setButtonsDisabled(true)
        }
    }

    const onCreatePipeline = async () => {
        console.log(newPipelineName)
        const currentPipelines = await axios.get(`/api/config?id=${pipelinesLabel}`)
        if (currentPipelines.data === '') {
            await axios.post('/api/config', { pipelines: [{ stages: [], name: newPipelineName }], id: pipelinesLabel })
        } else {
            currentPipelines.data.pipelines.push({ stages: [], name: newPipelineName })
            await axios.post('/api/config', currentPipelines.data)
        }
        setSelectedPipeline({ stages: [], name: newPipelineName })
    }

    const onCreateCogSearchPipeline = async () => {
        console.log(newPipelineName)
        let currentPipelines = await axios.get(`/api/config?id=${pipelinesLabel}`)
        if (currentPipelines.data === '') {
            const newPipelines = { id: 'pipelines', pipelines: [getStage1(newPipelineName),getStage2(newPipelineName),getCogStage3(newPipelineName)]}
            currentPipelines.data = newPipelines
            await axios.post('/api/config', currentPipelines.data)
        } else {
            currentPipelines.data.pipelines.push(getStage1(newPipelineName))
            currentPipelines.data.pipelines.push(getStage2(newPipelineName))
            currentPipelines.data.pipelines.push(getCogStage3(newPipelineName))
            await axios.post('/api/config', currentPipelines.data)
        }
        setPipelines(currentPipelines.data.pipelines)
        await axios.get(`/api/cogsearch?pipeline=${newPipelineName}`)
        //setSelectedPipeline({ stages: [], name: newPipelineName })
    }

    const onCreateVectorPipeline = async () => {
        console.log(newPipelineName)
        const currentPipelines = await axios.get(`/api/config?id=${pipelinesLabel}`)
        if (currentPipelines.data === '') {
            await axios.post('/api/config', { pipelines: [getStage1(newPipelineName),getStage2(newPipelineName),getStage3(newPipelineName)]})
        } else {
            currentPipelines.data.pipelines.push(getStage1(newPipelineName))
            currentPipelines.data.pipelines.push(getStage2(newPipelineName))
            currentPipelines.data.pipelines.push(getStage3(newPipelineName))
            await axios.post('/api/config', currentPipelines.data)
        }
        setPipelines(currentPipelines.data.pipelines)
        await axios.get(`/api/cogsearch?pipeline=${newPipelineName}&vector=true`)
        //setSelectedPipeline({ stages: [], name: newPipelineName })
    }

    const onPipelineSelect = (pn) => {
        if (pipelines) {
            for (const p of pipelines) {
                if (p.name === pn) {
                    setSelectedPipeline(p)
                }
            }
        }
    }

    const onDeletePipeline = async (pn) => {

        // if (currentPipelines.data === '') {
        //     await axios.post('/api/config', { pipelines: [{ stages: [], name: newPipelineName }], id: pipelinesLabel })
        // } else {
        //     currentPipelines.data.pipelines.push({ stages: [], name: newPipelineName })
        //     await axios.post('/api/config', currentPipelines.data)
        // }


        if (pipelines) {
            const currentPipelines = await axios.get(`/api/config?id=${pipelinesLabel}`)
            currentPipelines.data.pipelines = currentPipelines.data.pipelines.filter(p => (p.name !== pn))
            await axios.post('/api/config', currentPipelines.data)
            setPipelines(currentPipelines.data.pipelines)
        }
    }

    const renderPipelines = () => {
        if (pipelines) {
            return (
                pipelines.map(p => {
                    return (
                        <div style={{ display: "flex" }}>
                            <div className="hoverPipeline" onClick={() => onPipelineSelect(p.name)} value={p.name} style={{ color: "blue", width: "10em" }}>
                                {p.name}
                            </div>
                            <div className="hoverPipeline" onClick={() => onDeletePipeline(p.name)} style={{ marginBottom: "20px" }}>
                                <DeleteOutline />
                            </div>
                        </div>
                    )
                }
                )
            )
        } else {
            return (
                <>
                    <Skeleton>
                        <Skeleton.Line width="30%" />
                        <Skeleton.Line width="30%" />
                        <Skeleton.Line width="30%" />
                        <Skeleton.Line width="30%" />
                    </Skeleton>
                </>)
        }
    }

    if (selectedPipeline) {
        return (<Stages onSelectContent={props.onSelectContent} selectedPipelineName={selectedPipeline.name} />)
    } else {
        return (
            <div style={{ paddingTop: "50px" }}>
                <Text weight="semibold" content="Create Or Select A Pipeline" style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "20px" }} />
                <p style={{ marginBottom: "20px" }} >BPA Accelerator can support more than one pipeline.  Each pipeline is linked to a directory in Blob Storage.  The path of the linked pipeline will be presented when the pipeline is created.</p>
                <Text weight="semibold" content="Existing Pipelines" style={{ fontSize: "14px", display: "block", width: "100%", marginBottom: "20px" }} />
                <div style={{ paddingBottom: "50px" }}>
                    {renderPipelines()}
                </div>
                <Text weight="semibold" content="Create New Pipeline"  style={{ fontSize: "14px", display: "block", width: "100%", marginBottom: "20px" }} />
                <div style={{ paddingBottom: "50px" }}>
                    <Text content="Enter New Pipeline Name" style={{ fontSize: "14px", display: "block", width: "100%", marginBottom: "20px" }} />
                    <Input style={{ height: "30px" }} value={newPipelineName} onChange={onPipelineNameChange} />
                </div>

                <Button content="Create Custom Pipeline" primary disabled={buttonsDisabled} onClick={onCreatePipeline} style={{ fontSize: "14px", display: "block", width: "100%", marginBottom: "20px" }} />
                <Button content="Prebuilt Cognitive Search Pipeline" primary disabled={buttonsDisabled} onClick={onCreateCogSearchPipeline} style={{ fontSize: "14px", display: "block", width: "100%", marginBottom: "20px" }} />
                <Button content="Prebuilt Vector Embedding Search" primary disabled={buttonsDisabled} onClick={onCreateVectorPipeline} style={{ fontSize: "14px", display: "block", width: "100%", marginBottom: "20px" }} />
            </div>
        )
    }


}