import { BpaServiceObject } from "../engine/types";
import { CosmosDB } from "../services/cosmosdb"


export class TableParser {

    private _db: CosmosDB

    constructor(cosmosDb: CosmosDB) {
        this._db = cosmosDb
    }

    public process = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {
        const services = ["customFormRec", "layout", "generalDocument"]
        let documentFields = []
        for (const s of services) {
            if (input?.aggregatedResults[s].documents) {
                for (const d of input.aggregatedResults[s].documents) {
                    if (d?.fields && Object.keys(d.fields).length > 0) {
                        documentFields.push(d.fields)
                    }
                }

                const _pageText: any = {}
                for (const p of input.aggregatedResults[s].pages) {
                    const pageNumber = p.pageNumber
                    let content = ""
                    for (const l of p.lines) {
                        content += l.content + " "
                    }
                    _pageText[p.pageNumber] = { pageNumber: pageNumber, content: content }
                }


                const tables = []
                let tableIndex = 0
                for (let t of input.aggregatedResults[s].tables) {
                    let table = t as any

                    let pageText = {}
                    if (t?.boundingRegions[0]?.pageNumber) {
                        pageText = _pageText[t.boundingRegions[0].pageNumber]
                    }
                    const content = { tableIndex: tableIndex++, type: "table", pipeline: input.pipeline, filename: input.filename, data: { documentFields: documentFields, table: table, pageContent: pageText } }
                    tables.push(content)
                    await this._db.create(content)
                }

                // const cells = []
                // for (const t of tables) {
                //     for (const c of t.table.cells) {
                //         cells.push({ company: company, type: type, date: date, cell: c, table: t })
                //         await this._db.create({ type: "cell", pipeline: input.pipeline, filename: input.filename, data: { company: company, type: type, date: date, cell: c, table: t } })
                //     }
                // }

                for (const t of tables) {
                    const cellOuterText: any = []
                    for (const c of t.data.table.cells) {
                        cellOuterText.push({ row: c.rowIndex, column: c.columnIndex, content: c.content })
                    }
                    for (const c of t.data.table.cells) {
                        if (c.columnIndex !== 0 || c.rowIndex !== 0) {
                            const contentArray = cellOuterText.filter((v: any) => {
                                if (c.columnIndex === v.column && v.row === 0) {
                                    return v
                                }
                                if (c.rowIndex === v.row && v.column === 0) {
                                    return v
                                }
                            })

                            let text = ""
                            for (const ca of contentArray) {
                                text += " " + ca.content
                            }

                            //cells.push({ company: company, type: type, date: date, cell: c, table: t, outerText: text })
                            await this._db.create({ type: "cell", pipeline: input.pipeline, filename: input.filename, data: { tableIndex: t.tableIndex, documentFields: documentFields, outerText: text, cell: c, table: t } })
                        } else {
                            //cells.push({ company: company, type: type, date: date, cell: c, table: t, outerText: "" })
                            await this._db.create({ type: "cell", pipeline: input.pipeline, filename: input.filename, data: { tableIndex: t.tableIndex, documentFields: documentFields, outerText: "", cell: c, table: t } })
                        }
                    }
                }

            }
        }



        let output: BpaServiceObject = input
        output.index++
        output.label = "tableParser"

        return output
    }

}
