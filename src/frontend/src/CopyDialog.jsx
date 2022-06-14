import React, { useState } from 'react'
import { Dialog, Text, TextArea } from '@fluentui/react-northstar';


export default function CopyDialog(props) {

    const [container, setContainer] = useState("")
    const [regexString, setRegexString] = useState("")
    const [key, setKey] = useState("")

    const onDialogSave = (event) => {
        console.log(event)
        const newOption = props.currentOption
        newOption.serviceSpecificConfig = { containerName : container, key : key, regexString : regexString }
        props.setHideDialog(true)
        props.addItemToPipeline(newOption)
    }

    const onDialogCancel = () => {
        props.setHideDialog(true)
    }

    const onKeyChange = (event, text) => {
        setKey(text.value)
    }

    const onRegexChange = (event, text) => {
        setRegexString(text.value)
    }

    const onContainerChange = (event, text) => {
        setContainer(text.value)
    }

    return (
        <Dialog
            header="Choose Container"
            content={
                <>
                    <div style={{
                            display: 'block', marginBottom: "10px"
                        }}>
                        <Text content="Container Name" style={{
                            display: 'block', marginBottom: "10px"
                        }} />

                        <TextArea value={container} onChange={onContainerChange}/>
                    </div>
                    <div style={{
                            display: 'block', marginBottom: "10px"
                        }}>
                        <Text content="Key" style={{
                            display: 'block', marginBottom: "10px"
                        }} />
                        <TextArea value={key} onChange={onKeyChange}/>
                    </div>
                    <div style={{
                            display: 'block', marginBottom: "10px"
                        }}>
                        <Text content="Regex String" style={{
                            display: 'block', marginBottom: "10px"
                        }} />
                        <TextArea value={regexString} onChange={onRegexChange}/>
                    </div>
                </>}
            open={!props.hideDialog}
            cancelButton="Cancel"
            confirmButton="Submit"
            onConfirm={onDialogSave}
            onCancel={onDialogCancel}
            style={{ overflow: "visible" }}
        />
    )
} 