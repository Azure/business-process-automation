import React, { useEffect, useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { Text, Checkbox, Dropdown } from '@fluentui/react-northstar';
import axios from 'axios'

function Upload(props) {
    const fileTypes = ["PNG", "JPG", "PDF", "BMP", "WAV", "MP3", "JPEG", "TIFF", "XML"];

    const [image, setImage] = useState(null);
    const [show, setShow] = useState(false);
    const [showFail, setShowFail] = useState(false);
    const [isCogSearch, setIsCogSearch] = useState(false)
    const [rerender, setRerender] = useState(0)
    const [pipelineNames, setPipelineNames] = useState([])
    const [selectedPipelineName, setSelectedPipelineName] = useState("")


    useEffect(() => {
        try {
            axios.get('/api/config?id=2').then(value => {
                if (value?.data?.createSkill) {
                    setIsCogSearch(value.data.createSkill)
                } else {
                    setIsCogSearch(false)
                }
            })

            axios.get('/api/config?id=pipelines').then(value => {
                if (value?.data?.pipelines) {
                    const names = []
                    for(const p of value.data.pipelines){
                        names.push(p.name)
                    }
                    setPipelineNames(names)
                } else {
                    setPipelineNames([])
                }
            })
        } catch (err) {
            console.log(err)
        }
    }, [rerender])

    const onCogSearchClick = async (event) => {
        try {
            await axios.post('/api/config', { createSkill: !isCogSearch, id: "2" })
        } catch (err) {
            console.log(err)
        }
        setRerender(rerender + 1)
    }

    const onDropDownChange = (event, selected) => {
        setSelectedPipelineName(selected.value)
    }

    const handleChange = async (file) => {
        try {
            if (file.name) {
                console.log(`image : ${file}`)
                setImage(file.name);
                console.log(image, show, showFail)
                const body = new FormData();
                body.append("file", file);
                console.log("sending...")
                const response = await fetch(`/api/documents?filename=${selectedPipelineName}/${file.name}`, {
                    method: "POST",
                    body
                });
                setShow(true)
                console.log(` response ${JSON.stringify(response.body)}`)
            } else {
                setShowFail(true)
            }
        } catch (err) {
            console.log(err)
            setShowFail(true)
        }
    }


    return (
        <div style={{ paddingTop: "50px" }}>
            <Text weight="semibold" content="Upload a document to Blob Storage" style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "20px" }} />
            <p style={{ marginBottom: "20px" }} >Before any insights can be viewed by a pattern, one or more documents must be uploaded.  The documents will be copied to Blob Storage which will trigger a Function App to process them.  The processing can take some time and the insights will not appear immediately.</p>
            <Text weight="semibold" content="Select Pipeline to Test" style={{ fontSize: "15px", display: "block", width: "100%", marginBottom: "20px" }} />
            <Dropdown
                search
                placeholder="Select the Pipeline"
                label="Output"
                items={pipelineNames}
                onChange={onDropDownChange}
                style={{paddingBottom : "40px"}}
            />
           
            <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
            <Checkbox onClick={onCogSearchClick} checked={isCogSearch} style={{ paddingTop: "20px" }} label="Create a Cognitive Search Index with the output of this document." />
        </div>
    )
}

export default Upload

