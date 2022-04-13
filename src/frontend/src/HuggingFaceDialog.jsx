import React, { useState } from 'react'
import { Dialog, Input } from '@fluentui/react-northstar';


export default function LanguageDialog(props) {

    const [modelId, setModelId] = useState(null)

    const onDialogSave = (event) => {
        console.log(event)
        const newOption = props.currentOption
        newOption.serviceSpecificConfig = { modelId: modelId }
        props.setHideDialog(true)
        props.addItemToPipeline(newOption)
    }

    const onDialogCancel = () => {
        props.setHideDialog(true)
    }

    const onChange = (event, value) => {
        setModelId(value.value)
    }

    return (
        <Dialog
            
            header="Hugging Face Model"
            content={<>
                    <Input label="Model ID" labelPosition="inline" value={modelId} onChange={onChange}/>
                        </>}
            open={!props.hideDialog}
            cancelButton="Cancel"
            confirmButton="Submit"
            onConfirm={onDialogSave}
            onCancel={onDialogCancel}
        />
    )
} 