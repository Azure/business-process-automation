import React from 'react';
import Result from './Result/Result';
import TableResult from './TableResult/TableResult'

import "./Results.css";

export default function Results(props) {


  const crawlDocument = (document, indexes, index, results) => {

    if (indexes.length === 0) return;
    if (index === indexes.length - 1) {
      if (document && indexes.length > index) {
        const tempOut = [...results, document[indexes[index]]]
        return tempOut
      }
      return results

    } else {
      if (document && indexes) {
        if (document && indexes && Array.isArray(document[indexes[index]])) {

          for (const item of document[indexes[index]]) {
            results = crawlDocument(item, indexes, index + 1, results)
          }
        } else {
          results = crawlDocument(document[indexes[index]], indexes, index + 1, results)
        }

        return results
      }
    }
    return []
  }

  const containsFacet = (index, facetList, facet) => {
    if (facetList[index] && facetList[index][facet]) {
      return true
    }
    return false
  }


  const getDocumentFacets = (document, indexes, collections) => {
    const results = {}
    for (const index of indexes) {
      const facetList = crawlDocument(document, index.split('/'), 0, [])
      for (const facet of facetList) {
        if (containsFacet(index, results, facet)) {
          results[index][facet]++
        } else {
          if (!results[index]) {
            results[index] = {}
          }
          results[index][facet] = 1
        }
      }
    }

    return results
  }

  let results = props.documents.map((result) => {
    if (props.useTableSearch) {
      return (
        <div key={result.id}>
          <TableResult
            searchables={props.searchables}
            document={result.filename.split('/')[result.filename.split('/').length - 1]}
            data={result}
            facets={getDocumentFacets(result, Object.keys(props.facets), props.filterCollections)}
          />

        </div>);

    } else {
      return (
        <div key={result.id}>
          <Result
            searchables={props.searchables}
            document={result.filename.split('/')[result.filename.split('/').length - 1]}
            data={result}
            facets={getDocumentFacets(result, Object.keys(props.facets), props.filterCollections)}
          />

        </div>);
    }

  });

  // let answers = props.answers.map((result) => {
  //   return <div className="card answer">
  //     <div className="card-body" style={{ textAlign: 'left' }}>
  //       <div style={{ fontWeight: 'bold' }}>
  //         Answer:
  //       </div>
  //       {result.text}
  //     </div>
  //   </div>
  // });

  let openAiAnswer = () => {
    if (props.useOpenAiAnswer) {
      return (<div className="card answer">
        <div className="card-body" style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 'bold' }}>
            OpenAI Answer:
          </div>
          {props.openAiAnswer}
        </div>
      </div>
      );
    }
  }


  let beginDocNumber = Math.min(props.skip + 1, props.count);
  let endDocNumber = Math.min(props.skip + props.top, props.count);

  return (
    <div>
      <p className="results-info">Showing {beginDocNumber}-{endDocNumber} of {props.count.toLocaleString()} results</p>
      <div className="row">
        {openAiAnswer()}
        {results}
      </div>
    </div>
  );
};
