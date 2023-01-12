import React, { useEffect, useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { Text, Dropdown } from '@fluentui/react-northstar';
import axios from 'axios'

//const cogsearchLabel = "cogsearch"
const pipelinesLabel = "pipelines"

function Upload(props) {
    const fileTypes = ["PNG", "JPG", "PDF", "BMP", "WAV", "MP3", "JPEG", "TIFF", "XML", "MP4","TIF"];

    const [image, setImage] = useState(null);
    const [show, setShow] = useState(false);
    const [showFail, setShowFail] = useState(false);
    //const [isCogSearch, setIsCogSearch] = useState(false)
    //const [rerender, setRerender] = useState(0)
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


            // axios.get(`/api/config?id=${cogsearchLabel}`).then(value => {
            //     if (value?.data?.createSkill) {
            //         setIsCogSearch(value.data.createSkill)
            //     } else {
            //         setIsCogSearch(false)
            //     }
            // })

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

    // const onCogSearchClick = async (event) => {
    //     try {
    //         await axios.post('/api/config', { createSkill: !isCogSearch, id: cogsearchLabel })
    //     } catch (err) {
    //         console.log(err)
    //     }
    //     setRerender(rerender + 1)
    // }

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

    const getContent = () => {
        let count = 0
        if (queueStatus && queueStatus.count) {
            count = queueStatus.count
        }
        return `Total Document Count In Database: ${count}`
    }

    const tableCellStyle = { backgroundColor: "white", borderStyle: "solid", borderWidth: "1px", textAlign: "left" }

    const getQueuedFiles = () => {
        if (queueStatus && queueStatus.messages.queuedFiles) {
            if (queueStatus.messages.queuedFiles.length > 0) {
                return (
                    <table>
                        <tr>
                            <td style={tableCellStyle}>Filename</td>
                            <td style={tableCellStyle}>State</td>
                            <td style={tableCellStyle}>Is Async Transaction</td>
                        </tr>
                        {queueStatus.messages.queuedFiles.map(f => {
                            return (
                                <tr>
                                    <td style={tableCellStyle}>{f.filename}</td>
                                    <td style={tableCellStyle}>{f.state}</td>
                                    <td style={tableCellStyle}>{f.isAsync.toString()}</td>
                                </tr>
                            )
                        })}


                    </table>
                )
                // <ul>
                //     {queueStatus.messages.queuedFiles.map(m => {
                //         if (m?.filename) {
                //             return (<>1</>)
                //         } else {
                //             return (<>2</>)
                //         }
                //     })}

                // </ul>
                //)
            }



        }
    }

    const getQueueStatus = () => {
        if (queueStatus?.messages?.queueProperties) {
            return (
                <table style={{ marginBottom: "30px" }}>
                    <tr>
                        <td style={tableCellStyle}>Active</td>
                        <td style={tableCellStyle}>Scheduled</td>
                        <td style={tableCellStyle}>Dead Letter</td>
                        <td style={tableCellStyle}>Transfer</td>
                        <td style={tableCellStyle}>Transfer Dead-Letter</td>
                    </tr>
                    <tr>
                        <td style={tableCellStyle}>{queueStatus.messages.queueProperties.activeMessageCount}</td>
                        <td style={tableCellStyle}>{queueStatus.messages.queueProperties.scheduledMessageCount}</td>
                        <td style={tableCellStyle}>{queueStatus.messages.queueProperties.deadLetterMessageCount}</td>
                        <td style={tableCellStyle}>{queueStatus.messages.queueProperties.transferMessageCount}</td>
                        <td style={tableCellStyle}>{queueStatus.messages.queueProperties.transferDeadLetterMessageCount}</td>
                    </tr>

                </table>
                // <Text weight="semibold" content="Empty" style={{ fontSize: "15px", display: "block", width: "100%", marginBottom: "20px" }} />
            )
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
                style={{ paddingBottom: "40px" }}
            />

            <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
            {/* <Checkbox onClick={onCogSearchClick} checked={isCogSearch} style={{ paddingTop: "20px", marginBottom: "20px" }} label="Create a Cognitive Search Data Source with the output of this document.  Sending more than one document while enabled will generate errors once the Data Source exists." /> */}
            <Text weight="semibold" content={getContent()} style={{ fontSize: "15px", display: "block", width: "100%", marginBottom: "20px" }} />
            {/* <Text weight="semibold" content="Queued Files Remaining To Be Processed: " style={{ fontSize: "15px", display: "block", width: "100%", marginBottom: "20px" }} /> */}

            {getQueueStatus()}
            {getQueuedFiles()}
        </div>
    )
}

export default Upload

