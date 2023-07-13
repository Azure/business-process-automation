import React, { useState } from 'react'
import { Dialog, TextArea, Text } from '@fluentui/react-northstar';


export default function OpenAiGenericDialog(props) {

    const [prompt, setPrompt] = useState(`Generate a summary of the following message : \${document}`)

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

    const instructions = `From the OpenAI Explorer, replace the text that will represent the plain text of your document or media with the string \${document}.  This has been updated to use the "chat" interface for 35-turbo and GPT-4`
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