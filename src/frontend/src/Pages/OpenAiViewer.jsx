import axios from "axios"
import { useEffect, useState } from "react"
import { Text, Dropdown } from '@fluentui/react-northstar';
import { JSONTree } from 'react-json-tree';

export default function OpenAiViewer(props) {

    const [pipelines, setPipelines] = useState([])
    const [selectedPipeline, setSelectedPipeline] = useState({ name: "no pipeline selected" })
    const [documents, setDocuments] = useState([])
    const [selectedDocument, setSelectedDocument] = useState(null)
    const [docData, setDocData] = useState(null)

    const theme = {
        base00: 'black',
        base01: 'black',
        base02: 'black',
        base03: 'black',
        base04: 'black',
        base05: 'black',
        base06: 'black',
        base07: 'black',
        base08: 'black',
        base09: 'black',
        base0A: 'black',
        base0B: 'black',
        base0C: 'black',
        base0D: 'black',
        base0E: 'black',
        base0F: 'black'
    };

    useEffect(() => {
        axios.get('/api/config?id=pipelines').then(_pipelines => {
            if (_pipelines) {
                _pipelines.data.pipelines.push({
                    name : "error"
                })
                setPipelines(_pipelines.data.pipelines)
                // if (_pipelines.data.pipelines.length > 0) {
                //     setSelectedPipeline(_pipelines.data.pipelines[0])
                // }

            }
        }).catch(err => {
            //setpipelineSearchDone(true)
            console.log(err)
        })
    }, [])

    useEffect(() => {
        if (selectedPipeline?.name !== "no pipeline selected") {
            axios.get(`/api/dbdocumentsbypipeline?pipeline=${selectedPipeline.name}`).then(_docs => {
                setDocuments(_docs.data)
            }).catch(err => {
                //setpipelineSearchDone(true)
                console.log(err)
            })
        }

    }, [selectedPipeline.name])

    useEffect(() => {
        if (selectedPipeline?.name !== "no pipeline selected" && selectedDocument) {
            axios.get(`/api/dbdocumentsbypipeline?pipeline=${selectedPipeline.name}&filename=${selectedDocument}`).then(_doc => {
                setDocData(_doc.data)
            }).catch(err => {
                //setpipelineSearchDone(true)
                console.log(err)
            })
        }

    }, [selectedPipeline.name, selectedDocument])

    const onPipelineChange = async (_, value) => {
        for (const p of pipelines) {
            if (p.name === value.value) {
                setSelectedPipeline(p)
            }
        }
    }

    // const renderPaging = () => {
    //     if (documents.length > 0) {
    //         return (
    //             <div>
    //                 <div>&lt;&lt;&lt;</div>

    //             </div>
    //         )
    //     }
    // }

    const onSelectedIndexChange = (value) => {
        const selectedFilename = value.currentTarget.innerHTML
        for(const d of documents){
            if(d === selectedFilename.trim()){
                setSelectedDocument(d)
                break;
            }
        }
    }

    const renderDocuments = () => {
        if (documents.length > 0) {

            return (
                <div style={{ marginTop: "40px", display: "flex", flexFlow: "row", flexWrap: "wrap", width: "100%" }}>
                    <div style={{ display: "flex", flexFlow: "column", flexWrap: "wrap", width: "30%" }}>
                        <div style={{ marginBottom: "20px", borderBottom: "solid", paddingBottom: "10px" }} >
                            <Text content="Filenames" />
                        </div>
                        <div style={{ height: "600px", overflow: "hidden", overflowY: "scroll", width:"100%" }} >
                            <ul>
                                {documents.map(m => {return (<div className="openaifilenames" onClick={onSelectedIndexChange} style={{paddingBottom : "20px"}}>{m} </div>)})}

                            </ul>
                            {/* <List styles={{margin: "20px"}}onSelectedIndexChange={onSelectedIndexChange} selectable items={documents.map(m => {return {key:m.filename, header:m.filename, content: "\n"}})} /> */}
                        </div>
                    </div>
                    <div style={{ width: "70%", padding: "50px" }}>
                        {(docData?.aggregatedResults?.ocr?.content) ? docData.aggregatedResults.ocr.content.slice(0,700)+"..." : ""}
                        {(docData?.aggregatedResults?.ocrToText) ? docData.aggregatedResults.ocrToText.slice(0,700)+"..." : ""}
                        {(docData?.aggregatedResults?.sttToText) ? docData.aggregatedResults.sttToText.slice(0,700)+"..." : ""}
                        <div style={{marginTop:"20px", fontWeight : "bold"}}>
                            {(docData?.aggregatedResults?.openaiGeneric) ? docData.aggregatedResults.openaiGeneric.map(v => v.choices[0].text) : ""}
                        </div>
                        <div style={{marginTop:"20px", fontWeight : "bold"}}>
                            {(docData?.aggregatedResults?.openaiSummarize?.choices[0].text) ? docData.aggregatedResults.openaiSummarize.choices[0].text : ""}
                        </div>
                        {(docData) ? <JSONTree data={docData} theme={theme} shouldExpandNode={() => false} /> : <></>}
                    </div>


                </div>

            )
        }
    }

    return (
        <div style={{ marginTop: "50px", marginBottom: "50px", display: "flex", flexFlow: "row", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexFlow: "column", fontWeight: "500" }}>
                <Text style={{ marginBottom: "10px" }} content="Choose a Pipeline" />
                <Dropdown
                    placeholder=""
                    label="Output"
                    items={pipelines.map(m => m.name)}
                    onChange={onPipelineChange}
                    defaultValue={selectedPipeline.name}
                    style={{ fontWeight: "400" }}
                />

            </div>
            {renderDocuments()}
        </div >
    )
}


