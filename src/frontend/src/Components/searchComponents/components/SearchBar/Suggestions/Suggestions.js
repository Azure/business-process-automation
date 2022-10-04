import React from 'react';

import "./Suggestions.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Suggestions(props) {

    const suggestionClickHandler = (e) => {
        props.suggestionClickHandler(e.currentTarget.id);
    }

    const borders = {
        border: "1px solid #eee",
        boxShadow: "0 2px 3px #ccc",
        boxSizing: "border-box"
    }

    let suggestions = props.suggestions.map((s, index) => {
        return (<div className="suggestion-item" key={index} id={s.text} onMouseDown={suggestionClickHandler}>{s.text}</div>);
      });

    return (
        <div style={borders}>
            {suggestions}
        </div>
    );
};
