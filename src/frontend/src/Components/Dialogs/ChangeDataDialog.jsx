import React, { useState } from 'react'
import { Dialog, Text, Dropdown } from '@fluentui/react-northstar';



export default function ChangeDataDialog(props) {

    const [selectedDataIndex, setSelectedDataIndex] = useState(null)

    const onDialogSave = (event) => {
        console.log(event)
        const newOption = props.currentOption
        newOption.serviceSpecificConfig = { dataIndex: selectedDataIndex }
        newOption.outputTypes = props.items[selectedDataIndex].outputTypes
        props.setHideDialog(true)
        props.addItemToPipeline(newOption)
    }

    const onDialogCancel = () => {
        props.setHideDialog(true)
    }

    const onDialogChange = (event, dropObject) => {
        setSelectedDataIndex(dropObject.highlightedIndex)
    }

    const convertItems = (items) => {
        const output = []
        for(const i of items){
            output.push(i.label)
        }
        return output
    }

    return (
        <Dialog
            header="Change Output Data"
            content={
                <>
                    <div style={{
                        display: 'block', marginBottom: "10px"
                    }}>
                        <Text content="Target Language" style={{
                            display: 'block', marginBottom: "10px"
                        }} />
                        <Dropdown
                            search
                            placeholder="Select Data To Output"
                            label="Output"
                            items={convertItems(props.items)}
                            onChange={onDialogChange}
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