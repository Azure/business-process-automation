import React from 'react';
//import pdf from '../../../images/pdf.svg'
import { JSONTree } from 'react-json-tree';

import './Result.css';

export default function Result(props) {
    return (
        <div className="card result">

            {/* <img className="card-img-top" src={pdf} alt={pdf}></img> */}
            <div className="card-body">
                <h6 className="title-style">{props.document}</h6>
                <div className="json-tree">
                    <JSONTree data={props.data} />
                </div>
            </div>
        </div>
    );
}
