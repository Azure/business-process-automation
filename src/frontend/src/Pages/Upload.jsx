import React, { useEffect, useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { Text, Dropdown } from '@fluentui/react-northstar';
import axios from 'axios'

const pipelinesLabel = "pipelines"

function Upload(props) {
    const fileTypes = ["PNG", "JPG", "PDF", "BMP", "WAV", "MP3", "JPEG", "TIFF", "XML", "MP4", "TIF", "PPT", "TXT", "DOC", "DOCX", "PPTX"];

    const [image, setImage] = useState(null);
    const [show, setShow] = useState(false);
    const [showFail, setShowFail] = useState(false);
    const [pipelineNames, setPipelineNames] = useState([])
    const [selectedPipelineName, setSelectedPipelineName] = useState("")
    const [queueStatus, setQueueStatus] = useState(null)

    useEffect(() => {
        try {
            axios.get(`/api/status`).then(value => {
                if (value?.data) {
                    setQueueStatus(value.data)
                }
            })
            setInterval(() => {
                axios.get(`/api/status`).then(value => {
                    if (value?.data) {
                        setQueueStatus(value.data)
                    }
                })
            }, 5000)


            axios.get(`/api/config?id=${pipelinesLabel}`).then(value => {
                if (value?.data?.pipelines) {
                    const names = []
                    for (const p of value.data.pipelines) {
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
    }, [])

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
                const response = await fetch(`/api/documents?filename=${selectedPipelineName}/${file.name}&pipeline=${selectedPipelineName}`, {
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

    const tableCellStyle = { backgroundColor: "white", borderStyle: "solid", borderWidth: "1px", textAlign: "left" }

    const getQueuedFiles = () => {

        if (queueStatus && queueStatus.messages.queuedFiles) {
            console.log(JSON.stringify(queueStatus.messages))
            if (queueStatus.messages.queuedFiles.length > 0) {
                return (
                    <table>
                        <tr>
                            <td style={tableCellStyle}>Filename</td>
                            <td style={tableCellStyle}>State</td>
                            <td style={tableCellStyle}>Is Async Transaction</td>
                            <td style={tableCellStyle}>Pipeline</td>
                            <td style={tableCellStyle}>Type</td>
                            <td style={tableCellStyle}>Label</td>
                        </tr>
                        {queueStatus.messages.queuedFiles.map(f => {
                            return (
                                <tr>
                                    <td style={tableCellStyle}>{f.filename}</td>
                                    <td style={tableCellStyle}>{f.state ? f.state : "n/a"}</td>
                                    <td style={tableCellStyle}>{f.isAsync ? f.isAsync.toString() : "n/a"}</td>
                                    <td style={tableCellStyle}>{f.pipeline ? f.pipeline : "n/a"}</td>
                                    <td style={tableCellStyle}>{f.type ? f.type : "n/a"}</td>
                                    <td style={tableCellStyle}>{f.label ? f.label : "n/a"}</td>
                                </tr>
                            )
                        })}
                    </table>
                )
            }
        }
    }

    const getQueueStatus = () => {
        if (queueStatus?.messages?.queueProperties) {
            return (
                <>
                    <Text weight="semibold" content="Request Queue" style={{ fontSize: "15px", display: "block", width: "100%", marginBottom: "20px", marginTop: "40px" }} />
                    <table style={{ marginBottom: "30px" }}>
                        <tr>
                            <td style={tableCellStyle}>Active</td>
                            <td style={tableCellStyle}>Scheduled</td>
                            <td style={tableCellStyle}>Failed</td>
                        </tr>
                        <tr>
                            <td style={tableCellStyle}>{queueStatus.messages.queueProperties.activeMessageCount}</td>
                            <td style={tableCellStyle}>{queueStatus.messages.queueProperties.scheduledMessageCount}</td>
                            <td style={tableCellStyle}>{queueStatus.messages.queueProperties.deadLetterMessageCount}</td>
                        </tr>

                    </table>
                </>
            )
        }

    }

    return (
        <div style={{ paddingTop: "50px" }}>
            <Text weight="semibold" content="Upload a document to Blob Storage" style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "20px" }} />
            <p style={{ marginBottom: "20px" }} >Before any insights can be viewed by a pattern, one or more documents must be uploaded.  The documents will be copied to Blob Storage which will trigger a Function App to process them.  The processing can take some time and the insights will not appear immediately.</p>
            <div>
                <div style={{ marginBottom: "10px" }}>
                    <Text weight="semibold" content="Select A Pipeline" style={{ fontSize: "15px", width: "100%", marginBottom: "20px" }} />
                </div>
                <Dropdown
                    search
                    placeholder="Select the Pipeline"
                    label="Output"
                    items={pipelineNames}
                    onChange={onDropDownChange}
                    style={{ paddingBottom: "40px" }}
                />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>


                <div style={{ marginRight: "30px" }}>
                    <div style={{ marginBottom: "10px" }}>
                        <Text weight="semibold" content="Upload A Single Document" style={{ fontSize: "15px", width: "100%", marginBottom: "20px" }} />
                    </div>
                    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
                </div>
            </div>
            {/* <Text weight="semibold" content={getContent()} style={{ fontSize: "15px", display: "block", width: "100%", marginBottom: "20px", marginTop: "40px" }} /> */}

            {getQueueStatus()}
            {getQueuedFiles()}
        </div>
    )
}

export default Upload

