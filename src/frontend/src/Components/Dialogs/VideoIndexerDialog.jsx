import React from 'react'
import { Dialog, Text } from '@fluentui/react-northstar';


export default function VideoIndexerDialog(props) {

    const onDialogSave = (event) => {
        props.setHideDialog(true)
        props.addItemToPipeline(props.currentOption)
    }

    const onDialogCancel = () => {
        props.setHideDialog(true)
    }

    return (
        <Dialog
            header="Video Indexer Notification"
            content={
                <>
                    <div style={{
                            display: 'block', marginBottom: "10px"
                        }}>
                        <Text content="Video Indexer requires additional deployments to be added to a pipeline.  Please refer to the readme for further instructions." style={{
                            display: 'block', marginBottom: "10px"
                        }} />
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