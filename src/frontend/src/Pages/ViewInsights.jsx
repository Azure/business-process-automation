import axios from "axios"
import { useEffect, useState } from "react"
import { Text, Dropdown, Checkbox } from '@fluentui/react-northstar';
//import AppHeader from "../Components/searchComponents/components/AppHeader/AppHeader";
import Search from '../Components/searchComponents/pages/Search/Search'

export default function ViewInsights(props) {

    const [indexes, setIndexes] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [indexSearchDone, setIndexSearchDone] = useState(false)
    const [useSemanticSearch, setUseSemanticSearch] = useState(false)
    const [facets, setFacets] = useState([])
    const [filterCollections ,setFilterCollections] = useState([])
    const [searchables, setSearchables] = useState([])
    const [semanticConfigs, setSemanticConfigs] = useState([])
    const [selectedSemanticConfig, setSelectedSemanticConfig] = useState("")
    //const [_ , setFacetsString] = useState("")

    useEffect(()=>{
        axios.get('/api/indexes').then(_indexes => {
            if(_indexes?.data?.indexes){
                setIndexes(_indexes.data.indexes)
                setSelectedIndex(_indexes.data.indexes[0].name)
                setIndexSearchDone(true)
                //setFacetsString(getFacetsString(_indexes.data.indexes[0].facetableFields))
                if(_indexes.data.indexes[0].facetableFields.length > 0){
                    setFacets(getFacetsString(_indexes.data.indexes[0].facetableFields).split(','))
                    setFilterCollections(_indexes.data.indexes[0].collections)
                }else{
                    setFacets([])
                    setFilterCollections([])
                }

                if(_indexes.data.indexes[0].searchableFields.length > 0){
                    setSearchables(_indexes.data.indexes[0].searchableFields)
                }else{
                    setSearchables([])
                }

                if(_indexes.data.indexes[0].semanticConfigurations.length > 0){
                    setSemanticConfigs(_indexes.data.indexes[0].semanticConfigurations)
                    setSelectedSemanticConfig(_indexes.data.indexes[0].semanticConfigurations[0].name)
                }else{
                    setSemanticConfigs([])
                    setSelectedSemanticConfig("")
                }
                
            }
        }).catch(err => {
            console.log(err)
        })
    },[])

    // const onFacetsChange = (_, value) => {
    //     setFacetsString(value.value)
    //     setFacets(value.value.split(','))
    // }

    const onIndexChange = (_, value) => {
        setSelectedIndex(value.value)
        for(const index of indexes){
            if(value.value === index.name){
                //setFacetsString(getFacetsString(index.facetableFields))
                if(index.facetableFields.length > 0){
                    const facetableFields = getFacetsString(index.facetableFields).split(',')
                    setFacets(facetableFields)
                    setFilterCollections(index.collections)
                } else {
                    setFacets([])
                    setFilterCollections([])
                }

                if(index.searchableFields.length > 0){
                    setSearchables(index.searchableFields)
                } else{
                    setSearchables([])
                }
                if(index.semanticConfigurations.length > 0){
                    setSemanticConfigs(index.semanticConfigurations)
                }else{
                    setSemanticConfigs([])
                    setSelectedSemanticConfig("")
                }

            }
        }
    }

    const onSemanticSearch = (_, value) => {
        setUseSemanticSearch(value.checked)
    }

    const onSemanticConfigChange = (_, value) => {
        setSemanticConfigs(value.value)
    }

    const getFacetsString = (facets) => {
        let result = ""
        let index = 0
        for(const facet of facets){
            if(index === 0){
                result = facet
            } else{
                result += `, ${facet}`
            }
            index++
        }
        return result
    }

    const renderSemanticSearchConfig = () => {
        if(useSemanticSearch){
            return(
                <>
                    <Text content="Semantic Search Configuration"  style={{marginBottom:"10px"}}/>
                    <Dropdown
                            placeholder=""
                            label="Output"
                            items={semanticConfigs.map(sc => sc.name)}
                            onChange={onSemanticConfigChange}
                            value={selectedSemanticConfig}
                            style={{fontWeight:"400"}}
                        />
                </>
                
            )
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
                            defaultValue={selectedIndex}
                            style={{fontWeight:"400"}}
                        />
                    </div>
                        
                    {/* <div style={style}>
                        <Text content="Facets"/>
                        <TextArea value={facetsString} label="label" onChange={onFacetsChange} style={{height:"40px", width: "300px"}}/>
                    </div> */}
                    <div style={style}>
                        <Checkbox onClick={onSemanticSearch} checked={useSemanticSearch} style={{marginBottom:"35px"}} label="Semantic Search" toggle />
                        
                    </div>
                    <div style={style}>
                        {renderSemanticSearchConfig()}
                    </div>
              </div>
                
                {/* <AppHeader/> */}
                <Search index={selectedIndex} searchables={searchables} filterCollections={filterCollections} facets={facets} useSemanticSearch={useSemanticSearch} semanticConfig={selectedSemanticConfig} />
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
    // const [indexes, setIndexes] = useState([])
    // const [selectedIndex, setSelectedIndex] = useState(null)
    // const [searchQuery, setSearchQuery] = useState('*')
    // const [searchResults, setSearchResults] = useState([])
    // const [useSemanticSearch, setUseSemanticSearch] = useState(false)
    // const [semanticConfiguration, setSemanticConfiguration] = useState("")
    // const [resultWaiting, setResultWaiting] = useState(false)

    // useEffect(() => {
    //     try {
    //         axios.get('/api/indexes').then(value => {
    //             setIndexes(value.data.indexes)
    //             if (value?.data?.indexes.length > 0) {
    //                 setSelectedIndex(value.data.indexes[0])
    //             }
    //         })
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }, [])

    // const onIndexChange = (event, item) => {
    //     setSelectedIndex(item.value)
    // }

    // const onSearchQuery = (event, item) => {
    //     setSearchQuery(item.value)
    // }

    // const onSemanticConfiguration = (event, item) => {
    //     setSemanticConfiguration(item.value)
    // }

    // const onSearch = async () => {
    //     console.log(searchQuery)
    //     try {
    //         setResultWaiting(true)
    //         const url = `/api/search?semantic=${useSemanticSearch}&index=${selectedIndex}&text=${searchQuery}&semanticConfig=${semanticConfiguration}`
    //         const axiosResult = await axios.get(url)
    //         setSearchResults(axiosResult.data.results)
    //         console.log(axiosResult.data.results["@search.answers"])
    //     } catch (err) {
    //         console.log(err)
    //     }
    //     setResultWaiting(false)
    // }

    // const onEnter = (event) => {
    //     if (event.key === 'Enter') {
    //         onSearch()
    //     }
    // }

    // const onSemanticSearch = (event, item) => {
    //     setUseSemanticSearch(!useSemanticSearch)
    // }

    // const renderIndexes = () => {
    //     if (indexes && selectedIndex) {
    //         return (
    //             <div style={{ paddingBottom: "20px" }}>
    //                 <Text content="Choose a Cognitive Search Index" style={{
    //                     display: 'flex', marginBottom: "10px"
    //                 }} />
    //                 <div style={{ display: "flex" }}>

    //                     <Dropdown
    //                         placeholder=""
    //                         label="Output"
    //                         items={indexes}
    //                         onChange={onIndexChange}
    //                         defaultValue={selectedIndex}
    //                         style={{ marginRight: "40px" }}
    //                     />
    //                     <Checkbox onClick={onSemanticSearch} checked={useSemanticSearch} label="Semantic Search" toggle />

    //                 </div>
    //                 {useSemanticSearch ? (
    //                     <>
    //                         <Text content="Select a Semantic Search Configuration" style={{ display: 'flex', marginTop: "10px" }} />
    //                         <Input value={semanticConfiguration} style={{ marginTop: "10px" }} onChange={onSemanticConfiguration} />
    //                     </>
    //                 ) : (<></>)}
    //                 <Input fluid value={searchQuery} style={{ marginTop: "30px" }} onKeyDown={onEnter} icon={<SearchIcon />} onChange={onSearchQuery} />
    //             </div>
    //         )
    //     } else {
    //         return (
    //             <div style={{ paddingBottom: "20px" }}>
    //                 <Text content="Accessing Cognitive Search Indexes ...." style={{
    //                     display: 'block', marginBottom: "10px"
    //                 }} />
    //             </div>
    //         )
    //     }
    // }

    // const renderResult = (result) => {
    //     const filenameSplit = result.filename.split('/')
    //     const filename = filenameSplit[filenameSplit.length - 1]
    //     const keys = Object.keys(result.aggregatedResults)

    //     return (
    //         <div style={{ display: "flex", flexDirection: "column", marginBottom: "30px", padding: "10px" }}>
    //             <Text weight="semibold" content={filename} style={{ fontSize: "20px", width: "100%", marginBottom: "20px" }} />
    //             {keys.map(key => {
    //                 const keyString = `${key} : `
                    
    //                 if (key === 'ocr') {
    //                     const panels = [{
    //                         key : "ocr",
    //                         title : "OCR Results",
    //                         content : result.aggregatedResults[key]
    //                     }]
    //                     return (
    //                         <div>
    //                             <Accordion panels = {panels} />
    //                             {/* <Text weight="semibold" content={result.aggregatedResults[key].substring(0, 500)} style={{ fontSize: "12px", width: "100%", marginBottom: "20px" }} /> */}
    //                         </div>
    //                     )
    //                 } else if (key === 'recognizeEntities'){
    //                     const panels = [{
    //                         key : "recognizeEntities",
    //                         title : "Entities (Language Service)",
    //                         content : result.aggregatedResults[key][0]["recognizeEntitiesResults"][0]["results"][0]["entities"].map(entity => {
    //                             let color = "red"
    //                             if(entity.category === 'Organization'){
    //                                 color = "light blue"
    //                             }
    //                             if(entity.category === 'Quantity'){
    //                                 color = "green"
    //                             }
    //                             if(entity.category === 'Address'){
    //                                 color = "orange"
    //                             }
    //                             if(entity.category === 'DateTime'){
    //                                 color = "purple"
    //                             }
    //                             if(entity.category === 'Skill'){
    //                                 color = "pink"
    //                             }
                        
    //                             return(<Pill size="smaller" style={{backgroundColor:`${color}`}}>{entity.text}</Pill>)
    //                         })
    //                     }]
    //                     return (
    //                         <div >
    //                             <Accordion panels = {panels} />
    //                             {/* <Text weight="semibold" content={result.aggregatedResults[key].substring(0, 500)} style={{ fontSize: "12px", width: "100%", marginBottom: "20px" }} /> */}
    //                         </div>
    //                     )
    //                 } else if (key === 'recognizePiiEntities'){
    //                     const panels = [{
    //                         key : "recognizePiiEntities",
    //                         title : "PII Entities (Language Service)",
    //                         content : JSON.stringify(result.aggregatedResults[key])
    //                     }]
    //                     return (
    //                         <div >
    //                             <Accordion panels = {panels} />
    //                             {/* <Text weight="semibold" content={result.aggregatedResults[key].substring(0, 500)} style={{ fontSize: "12px", width: "100%", marginBottom: "20px" }} /> */}
    //                         </div>
    //                     )
    //                 }else {
    //                     return (
    //                         <div style={{ display: 'block', marginBottom: "5px" }}>
    //                             <Text weight="semibold" content={keyString} style={{ fontSize: "18px", width: "100%", marginBottom: "30px" }} />
    //                             <Text weight="semibold" content={JSON.stringify(result.aggregatedResults[key]).substring(0, 500)} style={{ fontSize: "12px", width: "100%", marginBottom: "20px" }} />
    //                         </div>
    //                     )
    //                 }
    //             })}
    //         </div>
    //     )
    // }

    // const renderResults = () => {
    //     if (searchResults && searchResults?.value && !resultWaiting) {
    //         return (
    //             <div style={{ marginTop: "40px" }}>
    //                 {searchResults["@search.answers"] ? (<>{searchResults["@search.answers"].map(answer => {
    //                     return (
    //                         <div style={{ backgroundColor: "limegreen", marginBottom: "30px", fontSize: "18px", padding: "10px" }}>
    //                             <Text weight="semibold" content="Answer: " style={{ fontSize: "18px", width: "100%", marginBottom: "30px" }} />
    //                             <div dangerouslySetInnerHTML={{ __html: answer.highlights }} />
    //                         </div>)
    //                 })
    //                 }</>) : (<></>)}
    //                 {searchResults.value.map(result => {
    //                     return (
    //                         <div style={{ backgroundColor: "rgb(243, 242, 241)" }}>
    //                             {renderResult(result)}
    //                         </div>
    //                     )
    //                 })}
    //             </div>
    //         )
    //     } else{
    //         return(<></>)
    //     }
    // }

    // return (
    //     <div style={{ paddingTop: "50px" }}>
    //         <Text weight="semibold" content="Cognitive Search Indexes" style={{ fontSize: "18px", width: "100%", marginBottom: "20px" }} />
    //         {renderIndexes()}
    //         {renderResults()}
    //     </div>
    // )
