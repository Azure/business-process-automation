import React, { useState } from 'react'
import { Dialog, Text, TextArea } from '@fluentui/react-northstar';


export default function CopyDialog(props) {

    const [container, setContainer] = useState("")
<<<<<<< HEAD
    const [regexString, setRegexString] = useState("")
    const [key, setKey] = useState("")
=======
>>>>>>> a5f5108c087574d4e1eb238b7fb9dbf406f0027b

    const onDialogSave = (event) => {
        console.log(event)
        const newOption = props.currentOption
<<<<<<< HEAD
        newOption.serviceSpecificConfig = { containerName : container, key : key, regexString : regexString }
=======
        newOption.serviceSpecificConfig = { containerName : container }
>>>>>>> a5f5108c087574d4e1eb238b7fb9dbf406f0027b
        props.setHideDialog(true)
        props.addItemToPipeline(newOption)
    }

    const onDialogCancel = () => {
        props.setHideDialog(true)
    }

<<<<<<< HEAD
    const onKeyChange = (event, text) => {
        setKey(text.value)
    }

    const onRegexChange = (event, text) => {
        setRegexString(text.value)
    }

    const onContainerChange = (event, text) => {
=======
    const onDialogChange = (event, text) => {
>>>>>>> a5f5108c087574d4e1eb238b7fb9dbf406f0027b
        setContainer(text.value)
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
<<<<<<< HEAD
                        <TextArea value={container} onChange={onContainerChange}/>
                    </div>
                    <div style={{
                            display: 'block', marginBottom: "10px"
                        }}>
                        <Text content="Key" style={{
                            display: 'block', marginBottom: "10px"
                        }} />
                        <TextArea value={key} onChange={onKeyChange}/>
                    </div>
                    <div style={{
                            display: 'block', marginBottom: "10px"
                        }}>
                        <Text content="Regex String" style={{
                            display: 'block', marginBottom: "10px"
                        }} />
                        <TextArea value={regexString} onChange={onRegexChange}/>
=======
                        <TextArea value={container} onChange={onDialogChange}/>
>>>>>>> a5f5108c087574d4e1eb238b7fb9dbf406f0027b
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