import React, { useState, useEffect } from 'react';
import axios from 'axios'
import PipelinePreview from './PipelinePreview'
import OptionCard from './OptionCard';
import _ from 'lodash'

import LanguageDialog from './LanguageDialog';
import FormRecCustomDialog from './FormRecCustomDialog';
import LanguageCustomNerDialog from './LanguageCustomNerDialog';
import LanguageMultiClassifyDialog from './LanguageMultiClassifyDialog';
import LanguageSingleClassifyDialog from './LanguageSingleClassifyDialog'
import HuggingFaceDialog from './HuggingFaceDialog'

import { sc } from './serviceCatalog'
import { Button, Label } from '@fluentui/react-northstar'


export default function Stages(props) {

    const [serviceCatalog] = useState(sc)
    const [stages, setStages] = useState([])
    const [value, setValue] = useState(0)
    const [options, setOptions] = useState([])
    const [hideTranslateDialog, setHideTranslateDialog] = useState(true)
    const [hideFormRecDialog, setHideFormRecDialog] = useState(true)
    const [hideCustomNerDialog, setHideCustomNerDialog] = useState(true)
    const [hideCustomSingleDialog, setHideCustomSingleDialog] = useState(true)
    const [hideCustomMultiDialog, setHideCustomMultiDialog] = useState(true)
    const [hideHuggingFaceDialog, setHideHuggingFaceDialog] = useState(true)

    const [currentOption, setCurrentOption] = useState(null)


    useEffect(() => {
        const getSC = async () => {
            const matchingOptions = getMatchingOptions({
                outputTypes: ["start"]
            })
            setOptions(matchingOptions)

            // const result = await axios.get('/api/serviceCatalog')
            // setServiceCatalog(result.data)
        }
        getSC()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onDone = async () => {
        try {
            await axios.post('/api/config', { stages: stages.slice(1, stages.length), id: "1" })
        } catch (err) {
            console.log(err)
        }

        props.onSelectContent({ currentTarget: { id: "CURRENT_PIPELINE" } })
        setOptions([])
    }

    const getMatchingOptions = (previousStage, allowAny) => {
        const _options = []
        for (const k in serviceCatalog) {
            for (const acceptedInputType of serviceCatalog[k].inputTypes) {
                if (acceptedInputType === "any" && allowAny) {
                    _options.push(serviceCatalog[k])
                    break;
                }
                if (previousStage.outputTypes.includes(acceptedInputType.toLowerCase())) {
                    _options.push(serviceCatalog[k])
                    break;
                }
            }
        }
        return _options
    }

    const onResetPipeline = () => {
        setStages([])
        const matchingOptions = getMatchingOptions({
            outputTypes: ["start"]
        })
        setOptions(matchingOptions)
    }

    const addItemToPipeline = (item) => {
        const _stages = _.cloneDeep(stages)
        const _event = _.cloneDeep(item)
        //in the case of 'any', copy the output type of the previous stage
        if (_event.outputTypes.includes('any')) {
            _event.outputTypes = _stages[_stages.length - 1].outputTypes
            _event.inputTypes = _stages[_stages.length - 1].outputTypes
        }
        _stages.push(_event)
        setStages(_stages)

        setOptions(getMatchingOptions(_event, true))
        setValue(value + 1)
    }


    const onItemClick = (event) => {
        console.log(event.name)
        if (event.name === 'translate') {
            setCurrentOption(_.cloneDeep(event))
            setHideTranslateDialog(false)
        }
        else if (event.name === 'huggingFaceNER') {
            setCurrentOption(_.cloneDeep(event))
            setHideHuggingFaceDialog(false)
        } else if (event.name === 'customFormRec') {
            setCurrentOption(_.cloneDeep(event))
            setHideFormRecDialog(false)
        } else if (event.name === 'recognizeCustomEntities') {
            setCurrentOption(_.cloneDeep(event))
            setHideCustomNerDialog(false)
        } else if (event.name === 'singleCategoryClassify') {
            setCurrentOption(_.cloneDeep(event))
            setHideCustomSingleDialog(false)
        } else if (event.name === 'multiCategoryClassify') {
            setCurrentOption(_.cloneDeep(event))
            setHideCustomMultiDialog(false)
        } else {
            addItemToPipeline(event)
        }

    }

    const renderOptions = () => {
        if (options) {
            return (
                <div style={{ display: "flex", flexWrap: "wrap", padding: "30px", overflow: "auto" }} >
                    {options.map((option) => {
                        return (<OptionCard option={option} onClickHandler={onItemClick} />)
                    })}
                </div>
            )
        }
    }

    const renderStageTop = () => {
        return (
            <>
                <Label style={{ color: "black" }}>Select a stage to add it to your pipeline configuration</Label>
                <LanguageSingleClassifyDialog hideDialog={hideCustomSingleDialog} setHideDialog={setHideCustomSingleDialog} currentOption={currentOption} addItemToPipeline={addItemToPipeline} />
                <LanguageMultiClassifyDialog hideDialog={hideCustomMultiDialog} setHideDialog={setHideCustomMultiDialog} currentOption={currentOption} addItemToPipeline={addItemToPipeline} />
                <LanguageCustomNerDialog hideDialog={hideCustomNerDialog} setHideDialog={setHideCustomNerDialog} currentOption={currentOption} addItemToPipeline={addItemToPipeline} />
                <FormRecCustomDialog hideDialog={hideFormRecDialog} setHideDialog={setHideFormRecDialog} currentOption={currentOption} addItemToPipeline={addItemToPipeline} />
                <LanguageDialog hideDialog={hideTranslateDialog} setHideDialog={setHideTranslateDialog} currentOption={currentOption} addItemToPipeline={addItemToPipeline} />
                <HuggingFaceDialog hideDialog={hideHuggingFaceDialog} setHideDialog={setHideHuggingFaceDialog} currentOption={currentOption} addItemToPipeline={addItemToPipeline} />

                {renderOptions(options)}
            </>
        )
    }

    const renderStageBottom = () => {
        if (stages && stages.length > 0) {
            return (
                <>
                    <Label style={{ color: "black" }}>Pipeline Preview</Label>
                    <PipelinePreview stages={stages} />
                    <div style={{
                        marginLeft: "700px",
                        marginBottom: "50px"
                    }}>
                        <Button onClick={onResetPipeline} content="Reset Pipeline" />{' '}
                        <Button onClick={onDone} content="Done" primary />{' '}
                    </div>
                </>
            )
        }
    }

    return (
        <div style={{ paddingLeft: "10px", paddingTop: "50px" }}>
            {renderStageTop()}
            {renderStageBottom()}
        </div>
    )
}