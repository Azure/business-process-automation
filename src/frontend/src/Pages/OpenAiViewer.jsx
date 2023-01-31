import axios from "axios"
import { useEffect, useState } from "react"
import { Text, Dropdown } from '@fluentui/react-northstar';
import { JSONTree } from 'react-json-tree';

export default function OpenAiViewer(props) {

    const [pipelines, setPipelines] = useState([])
    const [selectedPipeline, setSelectedPipeline] = useState({ name: "no pipeline selected" })
    //const [pipelineSearchDone, setpipelineSearchDone] = useState(false)
    const [documents, setDocuments] = useState([])

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
                if (_pipelines.data.pipelines.length > 0) {
                    setSelectedPipeline(_pipelines.data.pipelines[0])
                }

            }
        }).catch(err => {
            //setpipelineSearchDone(true)
            console.log(err)
        })
    }, [])

    useEffect(() => {
        if(selectedPipeline?.name !== "no pipeline selected"){
            axios.get(`/api/dbdocumentsbypipeline?pipeline=${selectedPipeline.name}`).then(_docs => {
                setDocuments(_docs.data)
            }).catch(err => {
                //setpipelineSearchDone(true)
                console.log(err)
            })
        }
        
    },[selectedPipeline])

    const onPipelineChange = async (_, value) => {
        for(const p of pipelines){
            if(p.name === value.value){
                setSelectedPipeline(p)
            }
        }
    }

    const renderDocuments = () => {
        if (documents) {
            return documents.map(m => {
                return (
                    <div className="card result" id={props.key}>

                        {/* <img className="card-img-top" src={pdf} alt={pdf}></img> */}
                        <div className="card-body">
                            <h6 className="title-style">{m.filename}</h6>
                            <p>{m?.aggregatedResults?.ocrToText ? m.aggregatedResults.ocrToText : ""}</p>
                            <h6 className="title-style">{m?.aggregatedResults?.openaiGeneric?.choices[0].text ? m.aggregatedResults.openaiGeneric.choices[0].text : ""}</h6>
                            {/* <div style={{ textAlign: "left" }}>
    {getText(props.searchables, props.data) ? getText(props.searchables, props.data).substring(0, 1000) : ""}
</div>
<div style={{ textAlign: "left" }}>
    {renderPills()}
</div> */}
                            <div className="json-tree">
                                <JSONTree data={m} theme={theme} shouldExpandNode={() => false} />
                            </div>
                        </div>
                    </div>)
            })
        }
    }

    return (
        <div style={{ marginTop: "50px", marginBottom: "50px", display: "flex", flexFlow: "row", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexFlow: "column", fontWeight: "500", margin: "20px" }}>
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


