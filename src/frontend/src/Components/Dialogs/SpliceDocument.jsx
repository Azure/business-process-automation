import React, { useState } from 'react'
import { Dialog, Input, Text } from '@fluentui/react-northstar';


export default function SpliceDocument(props) {

    const [from, setFrom] = useState('0')
    const [to, setTo] = useState('1')
    
    const onDialogSave = (event) => {
        console.log(event)
        const newOption = props.currentOption
        newOption.serviceSpecificConfig = {
            from : Number(from),
            to: Number(to)
        }
        props.setHideDialog(true)
        props.addItemToPipeline(newOption)
    }

    const onDialogCancel = () => {
        props.setHideDialog(true)
    }

    const onFromPromptChange = (_, newValue) => {
        setFrom(newValue.value)
    }

    const onToPromptChange = (_, newValue) => {
        setTo(newValue.value)
    }

    const instructions = `Set the 'From' and 'To' page numbers to truncate the pdf into a smaller document.`
    return (
        <Dialog
            header="Splice PDF"
            content={<div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                <Text style={{ marginBottom: "30px" }}>
                    {instructions}
                </Text>
                <Input label="From" value={from} onChange={onFromPromptChange} style={{ marginBottom: "30px", width: "50px", height: "40px" }} />
                <Input label="To" value={to} onChange={onToPromptChange} style={{ marginBottom: "10px", width: "50px", height: "40px" }} />
            </div>}
            open={!props.hideDialog}
            cancelButton="Cancel"
            confirmButton="Submit"
            onConfirm={onDialogSave}
            onCancel={onDialogCancel}
        />
    )
} 