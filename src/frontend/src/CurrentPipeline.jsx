import axios from "axios"
import { useEffect, useState } from "react"
import PipelinePreview from './PipelinePreview'
import { Text } from '@fluentui/react-northstar';


export default function Stages(props) {

    const [pipelines, setPipelines] = useState([])

    useEffect(() => {
        try {
            axios.get('/api/config?id=pipelines').then(value => setPipelines(value.data.pipelines))
        } catch (err) {
            console.log(err)
        }

    }, [])

    const renderPipelines = () => {

        if (pipelines) {
            return (
                pipelines.map(p => {
                    return (
                        <div style={{marginBottom : "100px"}}>
                            <Text weight="semibold" content={p.name} style={{ fontSize: "14px", display: "block", width: "100%", marginBottom: "20px", marginLeft : "100px" }} />
                            <PipelinePreview theme={props.theme} stages={p.stages} />
                        </div>
                    )
                })
            )
        }
    }

    return (
        <div style={{ paddingTop: "50px" }}>
            <Text weight="semibold" content="Pipelines" style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "20px" }} />
            {renderPipelines()}

        </div>
    )
}