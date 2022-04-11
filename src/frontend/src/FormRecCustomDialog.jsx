import React, {useState} from 'react'
import { Dialog, DialogFooter, Button, Input } from '@fluentui/react-northstar';


export default function FormRecCustomDialog(props) {

    const [modelId, setModelId] = useState(null)

    const toggleHideDialog = () => {
        props.setHideDialog(!props.hideDialog)
    }

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
        setModelId(newValue)
    }


    return (
        <Dialog
            hidden={props.hideDialog}
            onDismiss={toggleHideDialog}
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
        >
            <Input value={modelId} onChange={onDialogChange}/>
            <DialogFooter>
                <Button onClick={onDialogSave} text="Save" />
                <Button onClick={onDialogCancel} text="Cancel" />
            </DialogFooter>
        </Dialog>
    )
} 