import React, { useState } from 'react'
import { Dialog, TextArea, Text } from '@fluentui/react-northstar';


export default function OpenAiRestDialog(props) {

    const [prompt, setPrompt] = useState(`{"temperature" : 0,"n": 1, "messages":[{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": "Document: \${document} Summarize this document."}]}`)

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

    const instructions = `Use the same JSON Input that you would use with something like Postman.`
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