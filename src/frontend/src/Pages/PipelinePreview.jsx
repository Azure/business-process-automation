import OptionCard from "../Components/OptionCard"
import { Text } from '@fluentui/react-northstar';
import { ArrowRightIcon } from '@fluentui/react-icons-northstar'


const display = (stages) => {
    return (
        <div style={{ display: "flex", padding: "30px", flexWrap: "wrap", justifyContent: "center"}} >
            {stages.map((option, index) => {
                console.log(`index : ${index}`)
                if (index === stages.length - 1) {
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
}

export default function PipelinePreview(props) {
    const stages = []

    
    if (props.stages && props.stages.length > 0) { 
        if(props.firstStage){
            stages.push(props.firstStage)
        }
        for(const s of props.stages){
            stages.push(s)
        }
        return display(stages)
    } else if (props.firstStage){
        stages.push(props.firstStage)
        return display(stages)
    }else {
        return (<>
            <div  style={{ display: "flex", padding: "30px", flexWrap: "wrap", justifyContent: "center"}}>
                <Text content="No configuration found"  />
                </div>
        </>)
    }
}