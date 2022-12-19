import React from 'react';
import { JSONTree } from 'react-json-tree';
import { Pill } from '@fluentui/react-northstar'

import './TableResult.css';

export default function Result(props) {

    const getNextColor = (index) => {
        const colors = ['lightblue', 'pink', 'lightyellow', 'orange', 'violet', 'lightgreen']
        return colors[index % (colors.length)]
    }

    const convertCellsToTableRows = (table) => {
        const rows = new Array(table.rowCount)
        for (var i = 0; i < table.rowCount; i++) {
            rows[i] = { key: i.toString(), items: new Array(table.columnCount) }
        }
        for (const c of table.cells) {
            rows[c.rowIndex].items[c.columnIndex] = c
        }
        return rows
    }

    const renderColumns = (row) => {
        return (
            row.items.map(c => {
                if(c.kind === 'content'){
                    return (
                        <td style={{backgroundColor:"white", borderStyle:"solid", borderWidth:"1px", textAlign:"left"}}>
                            {c.content}
                        </td>
                    )
                } else{
                    return (
                        <td style={{backgroundColor:"white", borderStyle:"solid", borderWidth:"1px", textAlign:"left", fontWeight:"bold"}}>
                            {c.content}
                        </td>
                    )
                }
            })
        )
    }

    const renderRows = (rows) => {
        return (
            rows.map(r => {
                return (
                    <tr>
                        {renderColumns(r)}
                    </tr>
                )
            })
        )
    }

    const renderTable = () => {
        const table = props.data.data.table
        const rows = convertCellsToTableRows(table)
        return (
            <table>

                {renderRows(rows)}
            </table>
        )

    }


    const renderPills = () => {
        if (props.facets) {
            return (
                Object.keys(props.facets).map((k, index) => {
                    return (
                        <div style={{textAlign:"left"}}>
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

    return (
        <div className="card result" id={props.key}>
            <div className="card-body">
                <h6 className="title-style">{props.document}</h6>
                <div>
                    {renderTable()}
                </div>
                <div>
                    {renderPills()}
                </div>

                <div className="json-tree">
                    <JSONTree data={props.data} theme={theme} shouldExpandNode={() => false} />
                </div>
            </div>
        </div>
    );
}
