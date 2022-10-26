import React from 'react';
import Result from './Result/Result';

import "./Results.css";

export default function Results(props) {

  let results = props.documents.map((result, index) => {
    return <Result 
        key={result.id} 
        searchables={props.searchables}
        document={result.filename.split('/')[result.filename.split('/').length - 1]}
        data={result}
        facets={props.facets}
      />;
  });

  let beginDocNumber = Math.min(props.skip + 1, props.count);
  let endDocNumber = Math.min(props.skip + props.top, props.count);

  return (
    <div>
      <p className="results-info">Showing {beginDocNumber}-{endDocNumber} of {props.count.toLocaleString()} results</p>
      <div className="row">
        {results}
      </div>
    </div>
  );
};
