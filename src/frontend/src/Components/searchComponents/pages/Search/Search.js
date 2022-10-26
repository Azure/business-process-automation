import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

import Results from '../../components/Results/Results';
import Pager from '../../components/Pager/Pager';
import Facets from '../../components/Facets/Facets';
import SearchBar from '../../components/SearchBar/SearchBar';

import "./Search.css";

export default function Search(props) {

  // let location = useLocation();
  // let history = useHistory();

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

  let resultsPerPage = top;

  // const updateFilters = (filters) => {
  //   let out = ""
  //   if(filters){
  //     for(const f of filters){
  //       const localFilter = f.field.replace(/\//g, '.')
  //       out += `${localFilter} eq '${f.value}'`

  //     }
  //   }
  //   return out
  // }

  const getFacetSearchConfig = (_facets) => {
    const result = []
    for(const _facet of _facets){
      result.push(`${_facet},count:1000`)
    }
    // let result = ""
    // for(const _facet of _facets.split(',')){
    //   result += `${_facet},count:1000`
    // }
    return result
  }

  useEffect(() => {

    //setIsLoading(true);
    setSkip((currentPage - 1) * top);
    const body = {
      q: q,
      top: top,
      skip: skip,
      filters: filters,
      facets: getFacetSearchConfig(props.facets),
      index: props.index,
      useSemanticSearch: props.useSemanticSearch,
      semanticConfig: props.semanticConfig,
      queryLanguage: "en-US",
      filterCollections : props.filterCollections
    };

    if (props.index) {
      axios.post('/api/search', body)
        .then(response => {
          //console.log(JSON.stringify(response.data))
          if (response?.data?.results?.value) {
            setResults(response.data.results.value);
            setResultCount(response.data.results["@odata.count"]);
            setIsLoading(false);
            if(response.data.results["@search.facets"])
            {
              setFacets(response.data.results["@search.facets"]);
            }
            setIsError(false)
          } else{
            setResults([]);
            setResultCount(0);
            setIsLoading(false);
            setIsError(true)
          }

        })
        .catch(error => {
          console.log(error);
          setIsLoading(false);
        });
    }

  }, [q, top, skip, filters, currentPage, props.index, props.facets, props.useSemanticSearch, props.semanticConfig, props.filterCollections]);

  // const executeSearch = () => {
  //   //setIsLoading(true);
  //   setSkip((currentPage - 1) * top);
  //   const body = {
  //     q: q,
  //     top: top,
  //     skip: skip,
  //     filters: filters,
  //     facets: [],
  //     index: props.index
  //   };

  //   if (props.index) {
  //     axios.post('/api/search', body)
  //       .then(response => {
  //         //console.log(JSON.stringify(response.data))
  //         if (response?.data?.results) {
  //           setResults(response.data.results);
            
  //           setResultCount(response.data.results.length);
  //           setIsLoading(false);
  //           if(response.data.results["@search.facets"])
  //           {
  //             setFacets(response.data.results["@search.facets"]);
  //           }
  //         }

  //       })
  //       .catch(error => {
  //         console.log(error);
  //         setIsLoading(false);
  //       });
  //   }
  // }

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
    setSkip((newPageNumber-1) * top);
  }

  var body;
  if (isLoading) {
    body = (
      <div className="col-md-9">
        <CircularProgress />
      </div>);
  } else if(isError){
    body = (
      <div className="col-md-9" style={{margin: "100px"}}>
         Search Failed.  Make sure you have Semantic Search enabled. 
      </div>);
  } 
  else {
    body = (
      <div className="col-md-9">
        <Results facets={facets} searchables={props.searchables} documents={results} top={top} skip={skip} count={resultCount}></Results>
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
