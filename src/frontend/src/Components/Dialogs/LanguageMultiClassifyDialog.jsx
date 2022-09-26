import React, {useState} from 'react'
import { Dialog, Input } from '@fluentui/react-northstar';


export default function LanguageMultiClassifyDialog(props) {

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
            header="Classify Multi Class"
            content={<>
                    <Input label="Project name" labelPosition="inline" value={projectName} onChange={onProjectNameDialogChange} style={{marginBottom: "10px"}}/>
                    <Input label="Deployment name" labelPosition="inline" value={deploymentName} onChange={onDeploymentNameDialogChange} />
                        </>}
            open={!props.hideDialog}
            cancelButton="Cancel"
            confirmButton="Submit"
            onConfirm={onDialogSave}
            onCancel={onDialogCancel}
        />
    )
} 