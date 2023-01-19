import axios from "axios"
import { useEffect, useState } from "react"
import { Text, Button, Input } from '@fluentui/react-northstar';

export default function ViewInsights(props) {

    const [documents, setDocuments] = useState([])
    //const [oaiAnswer, setOiaAnswer] = useState(null)
    const [query, setQuery] = useState("")


    useEffect(() => {


    }, [])

    const onQueryChange = (_, value) => {
        setQuery(value.value)
    }

    const onSearch = () => {
        axios.get(`/api/vectorSearch?query=${query}`).then(r => {
            setDocuments(r.data.documents)
            //setOiaAnswer(r.data.oaiAnswer)
        })
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
                                {d.document.aggregatedResults.ocr}
                            </div>
                            {/* <div style={{ textAlign: "left" }}>
                                {renderPills()}
                            </div>
                            <div className="json-tree">
                                <JSONTree data={props.data} theme={theme} shouldExpandNode={() => false} />
                            </div> */}
                        </div>
                    </div>
                )
            })
        }
    }

    const style = { display: "flex", flexFlow: "column", fontWeight: "500", margin: "20px" }
    return (
        <>
            <div style={{ marginTop: "50px", marginBottom: "50px", display: "flex", flexFlow: "row", flexWrap: "wrap" }}>
                <div style={style}>
                    <Text content="Query:" style={{ marginBottom: "10px" }} />
                    <Input value={query} onChange={onQueryChange} fluid style={{ width: "300px", marginBottom: "10px" }} />
                    <Button primary style={{ width: "100px", marginBottom: "10px" }} onClick={onSearch}>Search</Button>
                    {renderDocuments()}
                </div>
            </div>
        </>
    )

}
