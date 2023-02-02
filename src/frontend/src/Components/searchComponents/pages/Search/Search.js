import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

import Results from '../../components/Results/Results';
import Pager from '../../components/Pager/Pager';
import Facets from '../../components/Facets/Facets';
import SearchBar from '../../components/SearchBar/SearchBar';

import "./Search.css";

export default function Search(props) {

  const [results, setResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [q, setQ] = useState("*");
  const [top] = useState(10);
  const [skip, setSkip] = useState(0);
  const [filters, setFilters] = useState([]);
  const [facets, setFacets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false)
  const [answers, setAnswers] = useState([])
  const [openAiAnswer, setOpenAiAnswer] = useState("")
  //const [openAiSummary, setOpenAiSummary] = useState("")

  let resultsPerPage = top;


  const getFacetSearchConfig = (_facets) => {
    const result = []
    for (const _facet of _facets) {
      if (_facet !== '') {
        result.push(`${_facet},count:1000`)
      }
    }
    return result
  }

  const getFacetsString = (facets) => {
    let result = ""
    let index = 0
    for (const facet of facets) {
      if (index === 0) {
        result = facet
      } else {
        result += `, ${facet}`
      }
      index++
    }
    return result
  }

  useEffect(() => {

    setIsLoading(true);
    setSkip((currentPage - 1) * top);
    const body = {
      q: q,
      top: top,
      skip: skip,
      filters: filters,
      facets: getFacetSearchConfig(getFacetsString(props.index.facetableFields).split(',')),
      index: props.index.name,
      useSemanticSearch: props.useSemanticSearch,
      semanticConfig: props.semanticConfig,
      queryLanguage: "en-US",
      filterCollections: props.index.collections
    };

    if (props.index) {
      axios.post('/api/search', body)
        .then(response => {
          //console.log(JSON.stringify(response.data))
          if (response?.data?.results?.value) {
            if(skip === 0 && props.useOpenAiAnswer && response.data.results.value.length > 0){
              axios.post(`/api/openaianswer`, {
                q : q,
                document : response.data.results.value[0]
              }).then(r => {
                setOpenAiAnswer(r.data.out.text)
              }).catch(e => {
                console.log(e)
              })
            }
            setResults(response.data.results.value);
            if (response.data.results.value.length > 0 && response.data.results.value[0]?.type && response.data.results.value[0].type === 'table') {
              props.onSetTableAvailable(true)
            } else {
              props.onSetTableAvailable(false)
            }
            setResultCount(response.data.results["@odata.count"]);
            setIsLoading(false);
            if (response.data.results["@search.facets"]) {
              setFacets(response.data.results["@search.facets"]);
            } else {
              setFacets([])
            }
            if (response.data.results["@search.answers"]) {
              setAnswers(response.data.results["@search.answers"]);
            } else {
              setAnswers([])
            }
            setIsError(false)
          } else {
            setResults([]);
            setResultCount(0);
            setIsLoading(false);
            setIsError(true)
            setFacets([])
            setAnswers([])
          }

        })
        .catch(error => {
          console.log(error);
          setIsLoading(false);
        });
    }

  }, [q, top, skip, filters, currentPage, props.index, props.useSemanticSearch, props.semanticConfig, props]);


  // pushing the new search term to history when q is updated
  // allows the back button to work as expected when coming back from the details page
  useEffect(() => {
    //history.push('/search?q=' + q);  
    setCurrentPage(1);
    setFilters([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);


  let postSearchHandler = (searchTerm) => {
    // pushing the new search term to history when q is updated
    // allows the back button to work as expected when coming back from the details page
    //history.push('/search?q=' + searchTerm);  
    setCurrentPage(1);
    setSkip(0);
    setFilters([]);
    setQ(searchTerm);
  }

  let updatePagination = (newPageNumber) => {
    setCurrentPage(newPageNumber);
    setSkip((newPageNumber - 1) * top);
  }

  var body;
  if (isLoading) {
    body = (
      <div className="col-md-9">
        <CircularProgress />
      </div>);
  } else if (isError) {
    body = (
      <div className="col-md-9" style={{ margin: "100px" }}>
        Search Failed.  Make sure you have Semantic Search enabled.
      </div>);
  }
  else {
    body = (
      <div className="col-md-9">
        <Results openAiAnswer={openAiAnswer} useTableSearch={props.useTableSearch} useOpenAiAnswer={props.useOpenAiAnswer} tableSearchConfig={props.tableSearchConfig} filterCollections={props.index.collections} answers={answers} facets={facets} searchables={props.index.searchableFields} documents={results} top={top} skip={skip} count={resultCount}></Results>
        <Pager className="pager-style" currentPage={currentPage} resultCount={resultCount} resultsPerPage={resultsPerPage} setCurrentPage={updatePagination}></Pager>
      </div>
    )
  }
  return (
    <main className="main main--search container-fluid">
      <div className="row">
        <div className="col-md-3">
          <div className="search-bar">
            <SearchBar postSearchHandler={postSearchHandler} q={q}></SearchBar>
          </div>
          <Facets facets={facets} filters={filters} setFilters={setFilters}></Facets>
        </div>
        {body}
      </div>
    </main>
  );
}
