import axios from "axios"
import { useEffect, useState } from "react"
import PipelinePreview from './PipelinePreview'
import { Text } from '@fluentui/react-northstar';


export default function Stages(props) {

    const [stages, setStages] = useState([])

    useEffect(() => {
        try {
            axios.get('/api/config?id=1').then(value => setStages(value.data.stages))
        } catch (err) {
            console.log(err)
        }

    }, [])


    return (
        <div style={{paddingTop: "50px" }}>
            <Text weight="semibold" content="Current Pipeline" style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "20px" }}/>
            <PipelinePreview theme={props.theme} stages={stages} />
        </div>
    )
}