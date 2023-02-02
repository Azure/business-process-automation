import axios from "axios"
import { useEffect, useState } from "react"
import { Text, Dropdown, List } from '@fluentui/react-northstar';
import { JSONTree } from 'react-json-tree';

export default function OpenAiViewer(props) {

    const [pipelines, setPipelines] = useState([])
    const [selectedPipeline, setSelectedPipeline] = useState({ name: "no pipeline selected" })
    const [documents, setDocuments] = useState([])
    const [selectedDocument, setSelectedDocument] = useState(null)

    const theme = {
        base00: 'white',
        base01: 'white',
        base02: 'white',
        base03: 'white',
        base04: 'white',
        base05: 'white',
        base06: 'white',
        base07: 'white',
        base08: 'white',
        base09: 'white',
        base0A: 'white',
        base0B: 'white',
        base0C: 'white',
        base0D: 'white',
        base0E: 'white',
        base0F: 'white'
    };

    useEffect(() => {
        axios.get('/api/config?id=pipelines').then(_pipelines => {
            if (_pipelines) {
                console.log('hello')
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

    }, [selectedPipeline])

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

    const onSelectedIndexChange = (value1, value) => {
        setSelectedDocument(documents[value.selectedIndex])
    }

    const renderDocuments = () => {
        if (documents.length > 0) {

            return (
                <div style={{ marginTop: "40px", display: "flex", flexFlow: "row", flexWrap: "wrap", width: "100%" }}>
                    <div style={{ display: "flex", flexFlow: "column", flexWrap: "wrap", width: "30%" }}>
                        <div style={{ marginBottom: "20px", borderBottom: "solid", paddingBottom: "10px" }} >
                            <Text content="Filenames" />
                        </div>
                        <div style={{ height: "600px", overflow: "hidden", overflowY: "scroll" }} >
                            <List onSelectedIndexChange={onSelectedIndexChange} selectable items={documents.map(m => m.filename)} />
                        </div>
                    </div>
                    <div style={{ width: "70%", padding: "50px" }}>
                        {(selectedDocument?.aggregatedResults?.ocr?.content) ? selectedDocument.aggregatedResults.ocr.content.slice(0,700)+"..." : ""}
                        <div style={{marginTop:"20px", fontWeight : "bold"}}>
                            {(selectedDocument?.aggregatedResults?.openaiGeneric?.choices[0].text) ? selectedDocument.aggregatedResults.openaiGeneric.choices[0].text : ""}
                        </div>
                        <div style={{marginTop:"20px", fontWeight : "bold"}}>
                            {(selectedDocument?.aggregatedResults?.openaiSummarize?.choices[0].text) ? selectedDocument.aggregatedResults.openaiSummarize.choices[0].text : ""}
                        </div>
                        <JSONTree data={selectedDocument} theme={theme} shouldExpandNode={() => false} />
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


