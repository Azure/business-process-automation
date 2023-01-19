import axios from "axios"
import { useEffect, useState } from "react"
import { Text, Button, Input } from '@fluentui/react-northstar';
import { JSONTree } from "react-json-tree";

export default function ViewInsights(props) {

    const [documents, setDocuments] = useState([])
    const [oaiAnswer, setOiaAnswer] = useState(null)
    const [query, setQuery] = useState("")


    useEffect(() => {


    }, [])

    const onQueryChange = (_, value) => {
        setQuery(value.value)
    }

    const onSearch = () => {
        axios.get(`/api/vectorSearch?query=${query}`).then(r => {
            setDocuments(r.data.documents)
            setOiaAnswer(r.data.oaiAnswer)
        })
    }

    const renderAnswer = () => {
        if (oaiAnswer) {
            return (
            <div className="card answer">
                <div className="card-body" style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold' }}>
                        Answer:
                    </div>
                    {oaiAnswer.choices[0].text}
                </div>
            </div>
            )
}
    }

const renderDocuments = () => {
    if (documents) {
        return documents.map((d) => {
            return (
                <div className="card result" id={d.document.id}>

                    {/* <img className="card-img-top" src={pdf} alt={pdf}></img> */}
                    <div className="card-body">
                        <h6 className="title-style">{d.document.filename}</h6>
                        <div style={{ textAlign: "left" }}>
                            {d.document.aggregatedResults.ocrToText}
                        </div>
                        {/* <div style={{ textAlign: "left" }}>
                                {renderPills()}
                        </div> */}
                        <div className="json-tree">
                            <JSONTree data={d.document} theme={theme} shouldExpandNode={() => false} />
                        </div>
                    </div>
                </div>
            )
        })
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


const style = { display: "flex", flexFlow: "column", fontWeight: "500", margin: "20px" }
return (
    <>

        <div style={{ marginTop: "50px", marginBottom: "50px", display: "flex", flexFlow: "row", flexWrap: "wrap" }}>
            <div style={style}>
                <Text content="Query:" style={{ marginBottom: "10px" }} />
                <Input value={query} onChange={onQueryChange} fluid style={{ width: "300px", marginBottom: "10px" }} />
                <Button primary style={{ width: "100px", marginBottom: "10px" }} onClick={onSearch}>Search</Button>
                {renderAnswer()}
                {renderDocuments()}
            </div>
        </div>
    </>
)

}
