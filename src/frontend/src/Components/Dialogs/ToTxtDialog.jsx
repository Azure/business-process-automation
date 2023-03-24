import React, { useState } from 'react'
import { Dialog, Text, TextArea } from '@fluentui/react-northstar';


export default function ToTxtDialog(props) {

    const [container, setContainer] = useState("")
    const [folder, setFolder] = useState("")

    const onDialogSave = (event) => {
        console.log(event)
        const newOption = props.currentOption
        newOption.serviceSpecificConfig = { containerName : container, folderName : folder }
        props.setHideDialog(true)
        props.addItemToPipeline(newOption)
    }

    const onDialogCancel = () => {
        props.setHideDialog(true)
    }

    const onContainerChange = (event, text) => {
        setContainer(text.value)
    }

    const onFolderChange = (event, text) => {
        setFolder(text.value)
    }

    return (
        <Dialog
            header="Choose Container"
            content={
                <>
                    <div style={{
                            display: 'block', marginBottom: "10px"
                        }}>
                        <Text content="Pipeline Name" style={{
                            display: 'block', marginBottom: "10px"
                        }} />
                        <TextArea value={container} onChange={onContainerChange}/>
                        <Text content="Pipeline Name" style={{
                            display: 'block', marginBottom: "10px"
                        }} />
                        <TextArea value={folder} onChange={onFolderChange}/>
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