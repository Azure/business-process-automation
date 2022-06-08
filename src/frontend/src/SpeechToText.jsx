import React, { useState } from 'react'
import { Dialog, Text } from '@fluentui/react-northstar';
import LanguageDropdown, { languages_bcp47 } from './LanguageDropdown'


export default function SpeechToTextDialog(props) {

    const [selectedSourceLanguage, setSelectedSourceLanguage] = useState(null)

    const onDialogSave = (event) => {
        console.log(event)
        const newOption = props.currentOption
        newOption.serviceSpecificConfig = { to : selectedSourceLanguage }
        props.setHideDialog(true)
        props.addItemToPipeline(newOption)
    }

    const onDialogCancel = () => {
        props.setHideDialog(true)
    }

    const onSourceDialogChange = (event, dropObject) => {
        setSelectedSourceLanguage(languages_bcp47[dropObject.highlightedIndex].key)
    }
    

    return (
        <Dialog
            header="Speech To Text Language"
            content={
                <>
                    <div style={{
                            display: 'block', marginBottom: "10px"
                        }}>
                        <Text content="Source Language" style={{
                            display: 'block', marginBottom: "10px"
                        }} />
                        <LanguageDropdown
                            languages={languages_bcp47}
                            onDialogChange={onSourceDialogChange}
                        />
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