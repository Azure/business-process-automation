import React, { useState } from 'react'
import { Dialog, Text, TextArea } from '@fluentui/react-northstar';


export default function ToTxtDialog(props) {

    // eslint-disable-next-line
    const [container, _] = useState("documents")
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

    // eslint-disable-next-line
    const onFolderChange = ( ev, text) => {
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
                        <Text content="Destination Pipeline for Output" style={{
                            display: 'block', marginBottom: "10px"
                        }} />
                        <TextArea value={folder} onChange={onFolderChange} style={{lineHeight: "8px"}}/>
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