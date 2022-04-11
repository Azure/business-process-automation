import React, { useState } from 'react'
import { Dialog } from '@fluentui/react-northstar';
import { Input, Label } from '@fluentui/react-northstar';


export default function LanguageCustomNerDialog(props) {

    const [projectName, setProjectName] = useState(null)
    const [deploymentName, setDeploymentName] = useState(null)

    const onDialogSave = (event) => {
        console.log(event)
        const newOption = props.currentOption
        newOption.serviceSpecificConfig = { projectName: projectName, deploymentName: deploymentName }
        props.setHideDialog(true)
        props.addItemToPipeline(newOption)
    }

    const onDialogCancel = () => {
        props.setHideDialog(true)
    }

    const onProjectNameDialogChange = (event, newValue) => {
        setProjectName(newValue.value)
    }

    const onDeploymentNameDialogChange = (event, newValue) => {
        setDeploymentName(newValue.value)
    }


    return (
        <Dialog

            content={{
                children: () => {
                    return (
                        <div style={{  }}>
                            <div>
                                <Label>Project Name</Label>
                                <Input value={projectName} onChange={onProjectNameDialogChange} />
                            </div>

                            <div>
                                <Label>Deployment Name</Label>
                                <Input value={deploymentName} onChange={onDeploymentNameDialogChange} />
                            </div>

                        </div>
                    )
                },
            }}
            open={!props.hideDialog}
            cancelButton="Cancel"
            confirmButton="Submit"
            onConfirm={onDialogSave}
            onCancel={onDialogCancel}
        />
    )
} 