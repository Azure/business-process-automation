import React, { useState } from 'react'
import { Dialog, Text, TextArea } from '@fluentui/react-northstar';


export default function ToTxtDialog(props) {

    const [container, setContainer] = useState("")
    const [folder, setFolder] = useState("")
    const [maxSegment, setMaxSegment] = useState("")

    const onDialogSave = (event) => {
        console.log(event)
        const newOption = props.currentOption
        newOption.serviceSpecificConfig = { containerName : container, folderName : folder, maxSegment : maxSegment }
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

    const onMaxSegmentChange = (event, text) => {
        setMaxSegment(text.value)
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
                        <Text content="Folder Name" style={{
                            display: 'block', marginBottom: "10px"
                        }} />
                        <TextArea value={folder} onChange={onFolderChange}/>
                        <Text content="Maximum Segment (number of tokens)" style={{
                            display: 'block', marginBottom: "10px"
                        }} />
                        <TextArea value={maxSegment} onChange={onMaxSegmentChange}/>
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