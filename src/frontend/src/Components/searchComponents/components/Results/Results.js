import { isString } from 'lodash';
import React from 'react';
import Result from './Result/Result';

import "./Results.css";

export default function Results(props) {


  // const getText = (searchables, data) => {
  //   try {
  //     if (searchables.length === 0) {
  //       return ""
  //     }
  //     let out = ""

  //     for (const s of searchables) {
  //       let currentData = data
  //       for (const i of s.split('/')) {
  //         currentData = currentData[i]
  //       }
  //       out += currentData
  //     }
  //     return out
  //   } catch (err) {
  //     console.log(err)
  //   }

  // }


  const crawlDocument = (document, indexes, index, results) => {

    if (indexes.length === 0) return;
    if (index === indexes.length - 1) {
      if (document[indexes[index]]) {
        const tempOut = [...results, document[indexes[index]]]
        return tempOut
      } 
      return results

    } else {
      if(document && indexes){
        if (document && indexes && Array.isArray(document[indexes[index]])) {

          for (const item of document[indexes[index]]) {
            results = crawlDocument(item, indexes, index + 1, results)
            console.log('here')
          }
        } else {
          results = crawlDocument(document[indexes[index]], indexes, index + 1, results)
          console.log('here')
        }
  
        return results
      }
    }
    return []
  }

  const containsFacet = (index, facetList, facet) => {
    if(facetList[index] && facetList[index][facet]){
      return true
    }
    return false
  }


  const getDocumentFacets = (document, indexes, collections) => {
    const results = {}
    for (const index of indexes) {
      const facetList = crawlDocument(document, index.split('/'), 0, [])
      for(const facet of facetList){
        if(containsFacet(index, results, facet)){
          results[index][facet]++
        } else {
          if(!results[index]){
            results[index] = {}
          }
          results[index][facet] = 1
        }
      }
    }

    return results
  }

  let results = props.documents.map((result) => {
    return <Result
      key={result.id}
      searchables={props.searchables}
      document={result.filename.split('/')[result.filename.split('/').length - 1]}
      data={result}
      facets={getDocumentFacets(result, Object.keys(props.facets), props.filterCollections)}
    />;
  });

  let answers = props.answers.map((result) => {
    return <div className="card answer">
      <div className="card-body" style={{ textAlign: 'left' }}>
        <div style={{ fontWeight: 'bold' }}>
          Answer:
        </div>
        {result.text}
      </div>
    </div>
  });

  let beginDocNumber = Math.min(props.skip + 1, props.count);
  let endDocNumber = Math.min(props.skip + props.top, props.count);

  return (
    <div>
      <p className="results-info">Showing {beginDocNumber}-{endDocNumber} of {props.count.toLocaleString()} results</p>
      <div className="row">
        {answers}
        {results}
      </div>
    </div>
  );
};
