import OptionCard from "./OptionCard"

import { Text } from '@fluentui/react-northstar';
import { ArrowRightIcon } from '@fluentui/react-icons-northstar'


export default function PipelinePreview(props) {
    if (props.stages && props.stages.length > 0) {
        return (
            <div style={{ display: "flex", padding: "30px", flexWrap: "wrap", justifyContent: "center"}} >
                {props.stages.map((option, index) => {
                    console.log(`index : ${index}`)
                    if (index === props.stages.length - 1) {
                        return (
                            <>
                                <OptionCard option={option} />
                            </>)
                    } else {
                        return (
                            <>
                                <OptionCard option={option} />
                                <div style={{width: "40px", marginTop: "auto", marginBottom: "auto"}}><ArrowRightIcon size="largest"/></div>
                            </>)
                    }
                })}
            </div>
        )
    } else {
        return (<>
            <div  style={{ display: "flex", padding: "30px", flexWrap: "wrap", justifyContent: "center"}}>
                <Text content="No configuration found"  />
                </div>
        </>)
    }
}