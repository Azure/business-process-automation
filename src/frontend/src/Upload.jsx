import React, { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { Text } from '@fluentui/react-northstar';



function Upload(props) {
    const fileTypes = ["PNG", "JPG", "PDF", "WAV"];

    const [image, setImage] = useState(null);
    const [show, setShow] = useState(false);

    const [showFail, setShowFail] = useState(false);

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
        <div style={{ paddingTop: "50px" }}>
            <Text weight="semibold" content="Upload a document to Blob Storage" style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "20px" }}/>
            <p style={{marginBottom: "20px"}} >Before any insights can be viewed by a pattern, one or more documents must be uploaded.  The documents will be copied to Blob Storage which will trigger a Function App to process them.  The processing can take some time and the insights will not appear immediately.</p>
                <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
        </div>
    )
}

export default Upload

