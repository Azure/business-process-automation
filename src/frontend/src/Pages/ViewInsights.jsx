import axios from "axios"
import { useEffect, useState } from "react"
import { Text, Dropdown, Checkbox } from '@fluentui/react-northstar';
import Search from '../Components/searchComponents/pages/Search/Search'

export default function ViewInsights(props) {

    const [indexes, setIndexes] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [indexSearchDone, setIndexSearchDone] = useState(false)
    const [useSemanticSearch, setUseSemanticSearch] = useState(false)
    const [useOpenAiAnswer, setUseOpenAiAnswer] = useState(false)
    const [selectedSemanticConfig, setSelectedSemanticConfig] = useState("")
    const [useTableSearch, setUseTableSearch] = useState(false)
    const [tableSearchConfig, setTableSearchConfig] = useState("")
    const [tableAvailable, setTableAvailable] = useState(false)

    useEffect(()=>{
        axios.get('/api/indexes').then(_indexes => {
            if(_indexes?.data?.indexes){
                setIndexSearchDone(true)
                setIndexes(_indexes.data.indexes)
                setSelectedIndex(_indexes.data.indexes[0]) 
            }
        }).catch(err => {
            setIndexSearchDone(true)
            console.log(err)
        })
    },[])


    const onIndexChange = (_, value) => {
        if(indexes && indexes.length > 0){
            const _index = indexes.find(i => i.name === value.value)
            setSelectedIndex(_index)
        }
        
    }

    const onSemanticSearch = (_, value) => {
        setUseSemanticSearch(value.checked)
        if(value.checked && selectedIndex && selectedIndex.semanticConfigurations && selectedIndex.semanticConfigurations.length > 0){
            setSelectedSemanticConfig(selectedIndex.semanticConfigurations[0].name)
        }
    }

    const onOpenAiAnswer = (_, value) => {
        setUseOpenAiAnswer(value.checked)
    }

    const onSemanticConfigChange = (_, value) => {
        setSelectedSemanticConfig(value.value)
    }

    const renderSemanticSearchConfig = () => {
        if(useSemanticSearch){
            return(
                <>
                    <Text content="Semantic Search Configuration"  style={{marginBottom:"10px"}}/>
                    <Dropdown
                            placeholder=""
                            label="Output"
                            items={selectedIndex.semanticConfigurations.map(sc => sc.name)}
                            onChange={onSemanticConfigChange}
                            value={selectedSemanticConfig}
                            style={{fontWeight:"400"}}
                        />
                </>
                
            )
        }
    }

    const onTableSearch = (_, value) => {
        setUseTableSearch(value.checked)
    }

    const onTableConfigChange = (_, value) => {
        setTableSearchConfig(value.value)
    }

    const renderTableSearchConfig = () => {
        if(useTableSearch){
            return(
                <>
                    <Text content="Table Search Configuration"  style={{marginBottom:"10px"}}/>
                    <Dropdown
                            placeholder=""
                            label="Output"
                            items={indexes.map(sc => sc.name)}
                            onChange={onTableConfigChange}
                            value={tableSearchConfig}
                            style={{fontWeight:"400"}}
                        />
                </>
                
            )
        }
    }

    const onSetTableAvailable = (available) => {
        setTableAvailable(available)
    }

    const renderTableSearch = () => {
        if(tableAvailable){
            return(<Checkbox onClick={onTableSearch} checked={useTableSearch} style={{marginBottom:"35px"}} label="Table Search" toggle />)
        }
    }

    if(selectedIndex){
        const style = {display:"flex", flexFlow:"column", fontWeight:"500", margin: "20px"}
        return(
            <> 
              <div style={{marginTop:"50px", marginBottom:"50px", display:"flex",flexFlow:"row",flexWrap:"wrap"}}>
                    <div style={style}>
                        <Text style={{marginBottom:"10px"}}content="Choose a Cognitive Search Index" />
                        <Dropdown
                            placeholder=""
                            label="Output"
                            items={indexes.map(index => index.name)}
                            onChange={onIndexChange}
                            defaultValue={selectedIndex.name}
                            style={{fontWeight:"400"}}
                        />
                    </div>
                    <div style={style}>
                        <Checkbox onClick={onSemanticSearch} checked={useSemanticSearch} style={{marginBottom:"35px"}} label="Semantic Search" toggle />
                    </div>
                    <div style={style}>
                        {renderSemanticSearchConfig()}
                    </div>
                    <div style={style}>
                        {renderTableSearch()}
                    </div>
                    <div style={style}>
                        {renderTableSearchConfig()}
                    </div>
                    <div style={style}>
                        <Checkbox onClick={onOpenAiAnswer} checked={useOpenAiAnswer} style={{marginBottom:"35px"}} label="OpenAI Summary and Answer" toggle />
                    </div>
              </div>
                
                {/* <AppHeader/> */}
                <Search index={selectedIndex} useSemanticSearch={useSemanticSearch} useOpenAiAnswer={useOpenAiAnswer} semanticConfig={selectedSemanticConfig} useTableSearch={useTableSearch} onSetTableAvailable={onSetTableAvailable} />
            </>
            )
    } else if (indexSearchDone){
        return(
            <>
                <div style={{ paddingBottom: "20px", paddingTop: "60px", fontWeight: "bold" }}>
                    <Text content="No Cognitive Search Indexes Exist" style={{
                    display: 'flex', marginBottom: "10px"
                }} />  
                </div>
               
            </>
        )
    } else {
        return(
            <>
                <div style={{ paddingBottom: "20px", paddingTop: "60px", fontWeight: "bold" }}>
                    <Text content="Searching for Cognitive Search Indexes" style={{
                    display: 'flex', marginBottom: "10px"
                }} />  
                </div>
               
            </>
        )
    }
}
 