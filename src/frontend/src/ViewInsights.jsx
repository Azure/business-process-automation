import axios from "axios"
import { useEffect, useState } from "react"
import PipelinePreview from './PipelinePreview'
import { Text } from '@fluentui/react-northstar';


export default function ViewInsights(props) {

    const [indexes, setIndexes] = useState([])

    useEffect(() => {
        try {
            axios.get('/api/cogsearch/indexes').then(value => setIndexes(value.data.indexes))
        } catch (err) {
            console.log(err)
        }

    }, [])

    const renderIndexes = () => {

        if (indexes) {
            return (
                indexes.map(p => {
                    return (
                        <div style={{marginBottom : "100px"}}>
                            <Text weight="semibold" content={p.name} style={{ fontSize: "14px", display: "block", width: "100%", marginBottom: "20px", marginLeft : "100px" }} />
                           
                        </div>
                    )
                })
            )
        }
    }

    return (
        <div style={{ paddingTop: "50px" }}>
            <Text weight="semibold" content="Pipelines" style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "20px" }} />
            {renderIndexes()}

        </div>
    )
}