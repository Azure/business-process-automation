import React, {useState} from 'react'
import { Dialog, Input, TextArea } from '@fluentui/react-northstar';


export default function OpenAiGenericDialog(props) {

    const [prompt, setPrompt] = useState(null)
    const [maxTokens, setMaxTokens] = useState(null)

    const onDialogSave = (event) => {
        console.log(event)
        const newOption = props.currentOption
        newOption.serviceSpecificConfig = { prompt: prompt, maxTokens: maxTokens }
        props.setHideDialog(true)
        props.addItemToPipeline(newOption)
    }

    const onDialogCancel = () => {
        props.setHideDialog(true)
    }

    const onPromptChange = (_, newValue) => {
        setPrompt(newValue.value)
    }

    const onMaxTokensChange = (_, newValue) => {
        setMaxTokens(newValue.value)
    }


    return (
        <Dialog
            header="Generic OpenAI Processing"
            content={<div style={{display:"flex", flexDirection:"column", textAlign:"left"}}>
                    <TextArea label="Prompt" labelPosition="inline" value={prompt} onChange={onPromptChange} style={{marginBottom: "10px"}}/>
                    <Input label="Maximum Tokens"  value={maxTokens} onChange={onMaxTokensChange} />
                        </div>}
            open={!props.hideDialog}
            cancelButton="Cancel"
            confirmButton="Submit"
            onConfirm={onDialogSave}
            onCancel={onDialogCancel}
        />
    )
} 