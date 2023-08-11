import React, { useState } from 'react'
import { Dialog, Text, TextArea } from '@fluentui/react-northstar';


export default function JSONToTextDialog(props) {

    const [textFields, setTextFields] = useState("")

    const onDialogSave = (event) => {
        console.log(event)
        const newOption = props.currentOption
        newOption.serviceSpecificConfig = { textFields : textFields}
        props.setHideDialog(true)
        props.addItemToPipeline(newOption)
    }

    const onDialogCancel = () => {
        props.setHideDialog(true)
    }

    // eslint-disable-next-line
    const onTextFieldsChange = ( ev, text) => {
        setTextFields(text.value)
    }


    return (
        <Dialog
            header="Choose Container"
            content={
                <>
                    <div style={{
                            display: 'block', marginBottom: "10px"
                        }}>
                        <Text content="Comma separated list of text fields to be concatenated." style={{
                            display: 'block', marginBottom: "10px"
                        }} />
                        <TextArea value={textFields} onChange={onTextFieldsChange} style={{lineHeight: "8px"}}/>
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