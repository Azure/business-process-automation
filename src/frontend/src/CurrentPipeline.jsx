import axios from "axios"
import { useEffect, useState } from "react"
import PipelinePreview from './PipelinePreview'
import { Label } from '@fluentui/react-northstar';


export default function Stages(props) {

    const [stages, setStages] = useState([])

    useEffect(() => {
        try {
            axios.get('/api/config').then(value => setStages(value.data.stages))
        } catch (err) {
            console.log(err)
        }

    }, [])


    return (
        <div style={{ paddingLeft: "0px", paddingTop: "50px" }}>
            <Label>Current Pipeline</Label>
            <PipelinePreview theme={props.theme} stages={stages} />
        </div>
    )
}