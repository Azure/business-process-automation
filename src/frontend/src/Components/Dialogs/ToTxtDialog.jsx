import React, { useState } from 'react'
import { Dialog, Text, TextArea } from '@fluentui/react-northstar';


export default function ToTxtDialog(props) {

    // eslint-disable-next-line
    const [container,_] = useState("documents")
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onFolderChange = (_, text) => {
        setFolder(text.value)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onMaxSegmentChange = (_, text) => {
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
                        <Text content="Destination Pipeline for Output" style={{
                            display: 'block', marginBottom: "10px"
                        }} />
                        <TextArea value={folder} onChange={onFolderChange} style={{lineHeight: "8px"}}/>
                        <Text content="Maximum Segment (number of tokens)" style={{
                            display: 'block', marginBottom: "10px"
                        }} />
                        <TextArea value={maxSegment} onChange={onMaxSegmentChange} style={{lineHeight: "8px"}}/>
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