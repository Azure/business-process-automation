import React, {useState, useEffect} from 'react';

import './Pager.css';

export default function Pager(props) {

    let [selectedPage, setSelectedPage] = useState(props.currentPage);
    let totalPages = Math.ceil(props.resultCount / props.resultsPerPage);

    useEffect(_=>{
        props.setCurrentPage(selectedPage);
    }, [selectedPage, props]);

    function goToNextPage() {
        setSelectedPage(selectedPage + 1);
    }

    function goToPreviousPage() {
        setSelectedPage(selectedPage - 1);
    }

    var i = 0;
    var page_links = [];

    var minPage = 1;
    var maxPage = totalPages;

    if (selectedPage - minPage > 2) {
        minPage = selectedPage - 2;
    }

    if (maxPage - selectedPage > 2) {
        maxPage = parseInt(selectedPage) + 2;
    }


    for (i = minPage; i <= maxPage; i++) {
        if (i === parseInt(selectedPage)) {
            page_links.push(
                <li className="page-item active" key={i}>
                    <span className="page-link">
                        {i}
                    </span>
                </li>
            );
        } else {
            page_links.push(
                <li className="page-item" key={i}>
                    <button className="page-link" id={i} onClick={(e) => setSelectedPage(e.currentTarget.id)}>{i}</button>
                </li>
            );
        }
    }

    var previousButton;
    if (parseInt(selectedPage) === 1) {
        previousButton = (<li className="page-item disabled" key="prev">
                            <span className="page-link">Previous</span>
                        </li>);
    } else {
        previousButton = (<li className="page-item" key="prev" onClick={goToPreviousPage}>
                            <button className="page-link">Previous</button>
                        </li>);
    }

    var nextButton;
    if (parseInt(selectedPage) === totalPages) {
        nextButton = (<li className="page-item disabled" key="next">
                            <span className="page-link">Next</span>
                        </li>);
    } else {
        nextButton = (<li className="page-item" key="next" >
                            <button className="page-link" onClick={goToNextPage}>Next</button>
                        </li>);
    }

    

    return (
        <nav aria-label="..."  className="pager">
            <ul className="pagination item">
                {previousButton}
                {page_links}
                {nextButton}
            </ul>
        </nav>
    );

    }