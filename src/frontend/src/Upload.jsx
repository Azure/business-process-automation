import React, { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { Label } from '@fluentui/react-northstar';



function Upload(props) {
    const fileTypes = ["PNG", "JPG", "PDF", "WAV"];

    const [image, setImage] = useState(null);
    const [show, setShow] = useState(false);

    const [showFail, setShowFail] = useState(false);

    const labelStyle = { paddingLeft: "20px" }
    const smallLabelStyle = { padding: "20px" }

    const handleChange = async (file) => {
        try {
            if (file.name) {
                console.log(`image : ${file}`)
                setImage(file.name);
                console.log(image, show, showFail)
                // setCreateObjectURL(URL.createObjectURL(i));
                const body = new FormData();
                body.append("file", file);
                console.log("sending...")
                const response = await fetch(`/api/documents?filename=${file.name}`, {
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
        <div style={{ paddingLeft: "10px", paddingTop: "50px" }}>
            <Label style={labelStyle}>Upload a document to Blob Storage</Label>
            <p style={smallLabelStyle}>Before any insights can be viewed by a pattern, one or more documents must be uploaded.  The documents will be copied to Blob Storage which will trigger a Function App to process them.  The processing can take some time and the insights will not appear immediately.</p>
            <div style={{padding:"20px"}}>
                <FileUploader styles={smallLabelStyle} handleChange={handleChange} name="file" types={fileTypes} />
            </div>
            


        </div>
    )
}

export default Upload

