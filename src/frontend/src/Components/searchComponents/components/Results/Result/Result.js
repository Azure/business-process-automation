import React, { useEffect, useState } from 'react';
//import pdf from '../../../images/pdf.svg'
import { JSONTree } from 'react-json-tree';
import { Pill, Dialog } from '@fluentui/react-northstar'
import './Result.css';

export default function Result(props) {

    const [redactedDoc, setRedactedDoc] = useState(null)
    const [hideDialog, setHideDialog] = useState(true)
    const [redactedUrl, setRedactedUrl] = useState("")

    const getNextColor = (index) => {
        const colors = ['lightblue', 'pink', 'lightyellow', 'orange', 'violet', 'lightgreen']
        return colors[index % (colors.length)]
    }

    const onDialogCancel = () => {
        setHideDialog(true)
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
        base00: 'white',
        base01: 'white',
        base02: 'white',
        base03: 'white',
        base04: 'white',
        base05: 'white',
        base06: 'white',
        base07: 'white',
        base08: 'white',
        base09: 'white',
        base0A: 'white',
        base0B: 'white',
        base0C: 'white',
        base0D: 'white',
        base0E: 'white',
        base0F: 'white'
    };


    const onRedactedDoc = (value) => {
        setRedactedDoc(value.currentTarget.innerText)
        setHideDialog(false)
    }

    useEffect(()=> {
        setRedactedUrl(`/api/viewpdf?container=translated-documents&filename=${redactedDoc}`)
    },[redactedDoc])

    const renderPath = (data) => {
        if (data?.aggregatedResults?.redactPdf?.outputLocation) {
            return (
                <>
                    Redacted Document : <span onClick={onRedactedDoc} style={{ color: "blue" }}>{data.aggregatedResults.redactPdf.outputLocation}</span>
                </>
            )
        }

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
