import { BpaServiceObject } from "../engine/types";
import { CosmosDB } from "../services/cosmosdb"


export class TableParser {

    private _db : CosmosDB

    constructor(cosmosDb : CosmosDB) {
        this._db = cosmosDb
    }

    public process = async (input: BpaServiceObject, index: number): Promise<BpaServiceObject> => {

        let company: string = ""
        let type: string = ""
        let date: string = ""
        for (const d of input.aggregatedResults.customFormRec.documents) {
            const stuff = d.fields
            if (d?.fields?.Company) {
                company = d.fields.Company.value
            }
            if (d?.fields?.Type) {
                type = d.fields.Type.value
            }
            if (d?.fields?.Date) {
                date = d.fields.Date.value
            }

        }

        const _pageText: any = {}
        for (const p of input.aggregatedResults.customFormRec.pages) {
            const pageNumber = p.pageNumber
            let content = ""
            for (const l of p.lines) {
                content += l.content + " "
            }
            _pageText[p.pageNumber] = { pageNumber: pageNumber, content: content }
        }


        const tables = []
        for (let t of input.aggregatedResults.customFormRec.tables) {
            let table = t as any

            let pageText = {}
            if (t?.boundingRegions[0]?.pageNumber) {
                pageText = _pageText[t.boundingRegions[0].pageNumber]
            }

            tables.push({ company: company, type: type, date: date, table: table, pageContent: pageText })
            await this._db.create({type: "table", pipeline : input.pipeline, filename : input.filename, data : { company: company, type: type, date: date, table: table, pageContent: pageText } })
        }

        const cells = []
        for (const t of tables) {
            for (const c of t.table.cells) {
                cells.push({ company: company, type: type, date: date, cell: c, table: t })
                await this._db.create({type: "cell", pipeline : input.pipeline, filename : input.filename, data : { company: company, type: type, date: date, cell: c, table: t } })
            }
        }

        let output : BpaServiceObject = input
        output.index++
        output.label = "tableParser"

        return output
    }

}
