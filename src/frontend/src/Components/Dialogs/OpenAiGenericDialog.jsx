import React, { useState } from 'react'
import { Dialog, TextArea, Text } from '@fluentui/react-northstar';


export default function OpenAiGenericDialog(props) {

    const [prompt, setPrompt] = useState(`{
        "prompt": "\${document}\ttldr;",
        "temperature": 0.7,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "best_of": 1,
        "max_tokens": 214,
        "stop": null\n}`)

    const onDialogSave = (event) => {
        console.log(event)
        const newOption = props.currentOption
        newOption.serviceSpecificConfig = prompt
        props.setHideDialog(true)
        props.addItemToPipeline(newOption)
    }

    const onDialogCancel = () => {
        props.setHideDialog(true)
    }

    const onPromptChange = (_, newValue) => {
        setPrompt(newValue.value)
    }

    const instructions = `From the OpenAI Explorer, replace the text that will represent the plain text of your document or media with the string \${document}.  Press "Code View", select JSON, and copy the contents here.`
    return (
        <Dialog
            header="Generic OpenAI Processing"
            content={<div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                <Text>
                    {instructions}
                </Text>
                <TextArea label="JSON" labelPosition="inline" value={prompt} onChange={onPromptChange} style={{ marginBottom: "10px", height: "400px" }} />
            </div>}
            open={!props.hideDialog}
            cancelButton="Cancel"
            confirmButton="Submit"
            onConfirm={onDialogSave}
            onCancel={onDialogCancel}
        />
    )
} 