import React, { useEffect, useState } from 'react';
//import pdf from '../../../images/pdf.svg'
import { JSONTree } from 'react-json-tree';
import { Pill, Dialog } from '@fluentui/react-northstar'
import './Result.css';

export default function Result(props) {

    const [redactedDoc, setRedactedDoc] = useState(null)
    const [hideDialog, setHideDialog] = useState(true)
    const [redactedUrl, setRedactedUrl] = useState("")
    const [hideOriginalDialog, setHideOriginalDialog] = useState(true)

    const getNextColor = (index) => {
        const colors = ['lightblue', 'pink', 'lightyellow', 'orange', 'violet', 'lightgreen']
        return colors[index % (colors.length)]
    }

    const onDialogCancel = () => {
        setHideDialog(true)
        setHideOriginalDialog(true)
    }


    const renderPills = () => {
        if (props.facets) {
            return (
                Object.keys(props.facets).map((k, index) => {
                    return (
                        <div>
                            {Object.keys(props.facets[k]).slice(0, 50).map(f => {
                                return (
                                    <Pill
                                        style={{ backgroundColor: getNextColor(index), color: "" }}
                                        content={`${f} (${props.facets[k][f]}) `}
                                        size="small"
                                    />
                                )
                            })}
                        </div>
                    )
                })
            )
        }
    }

    const getText = (searchables, data) => {
        try {
            if (!searchables || searchables.length === 0) {
                return ""
            }
            let out = ""

            for (const s of searchables) {
                let currentData = data
                for (const i of s.split('/')) {
                    if (Array.isArray(currentData[i])) {
                       currentData = currentData[i][0]
                    } else {
                        currentData = currentData[i]
                    }
                }
                out += currentData
            }
            return out
        } catch (err) {
            console.log(err)
        }

    }

    const theme = {
        base00: 'black',
        base01: 'black',
        base02: 'black',
        base03: 'black',
        base04: 'black',
        base05: 'black',
        base06: 'black',
        base07: 'black',
        base08: 'black',
        base09: 'black',
        base0A: 'black',
        base0B: 'black',
        base0C: 'black',
        base0D: 'black',
        base0E: 'black',
        base0F: 'black'
    };


    const onRedactedDoc = (value) => {
        setRedactedDoc(value.currentTarget.innerText.slice(1))
        setHideDialog(false)
    }

    const onOriginalDoc = (value) => {
        setHideOriginalDialog(false)
    }

    useEffect(()=> {
        setRedactedUrl(`/api/viewpdf?container=translated-documents&filename=${redactedDoc}`)
    },[redactedDoc])

    const renderPath = (data) => {
        if (data?.aggregatedResults?.redactPdf?.outputLocation) {
            return (
                <>
                <div>
                    Redacted Document : <span onClick={onRedactedDoc} style={{ color: "blue" }}>{data.aggregatedResults.redactPdf.outputLocation}</span>
                </div>
                <div>
                    Original Document : <span onClick={onOriginalDoc} style={{ color: "blue" }}>{data.filename}</span>
                </div>   
                </>
            )
        } else {
            return (
                <>
                <div>
                    Original Document : <span onClick={onOriginalDoc} style={{ color: "blue" }}>{data.filename}</span>
                </div>   
                </>
            )
        }

    }

    const originalUrl = () => {
        return `/api/viewpdf?container=documents&filename=${props.data.filename}`
    }

    return (
        <div className="card result" id={props.key}>

            {/* <img className="card-img-top" src={pdf} alt={pdf}></img> */}
            <div className="card-body">
                <h6 className="title-style">{props.document}</h6>
                <div style={{ textAlign: "left" }}>
                    {getText(props.searchables, props.data) ? getText(props.searchables, props.data).substring(0, 1000) : ""}
                </div>
                <div style={{ textAlign: "left", marginTop: "20px", marginBottom: "20px" }}>
                    {renderPath(props.data)}
                </div>
                <div style={{ textAlign: "left" }}>
                    {renderPills()}
                </div>
                <div className="json-tree">
                    <JSONTree data={props.data} theme={theme} shouldExpandNode={() => false} />
                </div>
                <Dialog
                    header="View PDF"
                    content={
                        <>
                            <div style={{
                                display: 'block', marginBottom: "10px"
                            }}>
                               
                                <iframe title="myFrameOriginal" src={originalUrl()} height="600" width="800"></iframe>
                            </div>
                        </>}
                    open={!hideOriginalDialog}
                    cancelButton="Cancel"
                    // confirmButton="Submit"
                    // onConfirm={onDialogSave}
                    onCancel={onDialogCancel}
                    style={{ overflow: "visible", width:"1000px" }}
                />
                <Dialog
                    header="View PDF"
                    content={
                        <>
                            <div style={{
                                display: 'block', marginBottom: "10px"
                            }}>
                               
                                <iframe title="myFrame" src={redactedUrl} height="600" width="800"></iframe>
                            </div>
                        </>}
                    open={!hideDialog}
                    cancelButton="Cancel"
                    // confirmButton="Submit"
                    // onConfirm={onDialogSave}
                    onCancel={onDialogCancel}
                    style={{ overflow: "visible", width:"1000px" }}
                />
            </div>
        </div>
    );


}
