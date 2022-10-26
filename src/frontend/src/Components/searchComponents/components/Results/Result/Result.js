import React from 'react';
//import pdf from '../../../images/pdf.svg'
import { JSONTree } from 'react-json-tree';
import { Pill } from '@fluentui/react-northstar'

import './Result.css';

export default function Result(props) {

    const getNextColor = (index) => {
        const colors = ['lightblue','pink','lightyellow','lightorange','lightpurple','lightgreen']
        return colors[index%(colors.length)]
    }


    const renderPills = () => {
        console.log(props.facets)
        if (props.facets) {
            return (
                Object.keys(props.facets).map((k,index) => {
                    return(
                        <div>
                            {props.facets[k].slice(0,20).map(f => {
                            return (<Pill
                                style={{ backgroundColor: getNextColor(index) }}
                                content={`${f.value} (${f.count})`}
                                size="small"
                            />)
                        })}
                        </div>
                        
                    )
                    
                })
            )
        }
    }

    const getText = (searchables, data) => {
        try{
            if (searchables.length === 0) {
                return ""
            }
            let currentData = data
            for (const s of searchables) {
                for (const i of s.split('/')) {
                    currentData = currentData[i]
                }
            }
            return currentData
        }catch(err){
            console.log(err)
        }
       
    }

    return (
        <div className="card result">

            {/* <img className="card-img-top" src={pdf} alt={pdf}></img> */}
            <div className="card-body">
                <h6 className="title-style">{props.document}</h6>
                <div style={{ textAlign: "left" }}>
                    {getText(props.searchables, props.data) ? getText(props.searchables, props.data).substring(0, 1000) : ""}
                </div>
                <div style={{ textAlign: "left" }}>
                    {renderPills()}
                </div>
                <div className="json-tree">
                    <JSONTree data={props.data} shouldExpandNode={() => false} />
                </div>
            </div>
        </div>
    );
}
