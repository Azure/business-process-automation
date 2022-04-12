import React, {useState} from 'react'
import { Dialog, Input } from '@fluentui/react-northstar';


export default function FormRecCustomDialog(props) {

    const [modelId, setModelId] = useState(null)

    const dialogContentProps = {
        title: 'Model ID',
        subText: 'Enter the Form Recognizer Custom Model ID',
    };

    const modalProps = {
        isBlocking: false,
        styles: { main: { maxWidth: 450 } },
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
            content={{
                children: () => {
                    return (
                        <div style={{}}>
                            <Label>Model ID</Label>
                            <Input value={modelId} onChange={onDialogChange} />
                        </div>
                    )
                },
            }}
            open={!props.hideDialog}
            cancelButton="Cancel"
            confirmButton="Submit"
            onConfirm={onDialogSave}
            onCancel={onDialogCancel}
            style={{ height: "200px" }}
        />
    )
} 