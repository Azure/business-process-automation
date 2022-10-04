import React, {useState} from 'react'
import { Dialog, Input, Text } from '@fluentui/react-northstar';


export default function FormRecCustomDialog(props) {

    const [modelId, setModelId] = useState(null)

    const dialogContentProps = {
        title: 'Model ID',
        subText: 'Enter the Form Recognizer Custom Model ID',
    };

    const onDialogSave = (event) => {
        console.log(event)
        const newOption = props.currentOption
        newOption.serviceSpecificConfig = { modelId: modelId }
        props.setHideDialog(true)
        props.addItemToPipeline(newOption)
    }

    const onDialogCancel = (event) => {
        props.setHideDialog(true)
    }

    const onDialogChange = (event, newValue) => {
        setModelId(newValue.value)
    }


    return (
        <Dialog
            header={dialogContentProps.title}
            content={
            <>
                <Text content={dialogContentProps.subText} style={{
                display: 'block', marginBottom: "20px"
                }}/>
                <Input label="Model ID" labelPosition="inline" value={modelId} onChange={onDialogChange} />
            </>
            }
            open={!props.hideDialog}
            cancelButton="Cancel"
            confirmButton="Submit"
            onConfirm={onDialogSave}
            onCancel={onDialogCancel}
        />
    )
} 