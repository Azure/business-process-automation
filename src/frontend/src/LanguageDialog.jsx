import React, { useState } from 'react'
import { Dialog, Dropdown, Text } from '@fluentui/react-northstar';


export default function LanguageDialog(props) {

    const [selectedLanguage, setSelectedLanguage] = useState(null)

    const languages = [
        { key: 'en', text: 'English' },
        { key: 'es', text: 'Spanish' },
        { key: 'th', text: 'Thai' },
        { key: 'fr', text: 'French' },
    ];

    const languagesToStrings = () => {
        const out = []
        for(const l of languages){
            out.push(l.text)
        }
        return out
    }

    const onDialogSave = (event) => {
        console.log(event)
        const newOption = props.currentOption
        newOption.serviceSpecificConfig = { to: selectedLanguage }
        props.setHideDialog(true)
        props.addItemToPipeline(newOption)
    }

    const onDialogCancel = () => {
        props.setHideDialog(true)
    }

    const onTranslateDialogChange = (event, dropObject) => {
            setSelectedLanguage(languages[dropObject.highlightedIndex].key)
    }

    return (
        <Dialog
            header="Language Translation"
            content={
                <>
                    <Text content="Select the language for your translation" style={{
                display: 'block', marginBottom: "20px"
                }}/>
                    <Dropdown
                        search
                        placeholder="Select an option"
                        label="Languages"
                        items={languagesToStrings()}
                        onChange={onTranslateDialogChange}
                            />
                        </>}
            open={!props.hideDialog}
            cancelButton="Cancel"
            confirmButton="Submit"
            onConfirm={onDialogSave}
            onCancel={onDialogCancel}
            style={{overflow: "visible"}}
        />
    )
} 