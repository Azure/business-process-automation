import React, {useState} from 'react';
import { Collapse, Checkbox, List, ListItem, ListItemText } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import styled from 'styled-components';

import './CheckboxFacet.css';

export default function CheckboxFacet(props) {

    let [isExpanded, setIsExpanded] = useState(false);

    const checkboxes = props.values.map(facetValue => {

        let isSelected = props.selectedFacets.some(facet => facet.value === facetValue.value);
        
        return (
            <FacetValueListItem dense disableGutters id={facetValue.value}>
                <Checkbox 
                    edge="start" 
                    disableRipple 
                    checked={isSelected}
                    onClick= {
                        isSelected ? 
                        () => props.removeFilter({field: props.name, value: facetValue.value}) :
                        () => props.addFilter(props.name, facetValue.value)
                    }
                />
                <ListItemText primary={facetValue.value + " (" + facetValue.count + ")"}/>
            </FacetValueListItem>
        );
    });


    return (
        <div>
            <FacetListItem disableRipple={true} button onClick={() => setIsExpanded(!isExpanded)}>
                <ListItemText 
                    primary={props.mapFacetName(props.name)}
                />
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </FacetListItem>
            <Collapse in={isExpanded} component="div">
                <FacetValuesList>
                    {checkboxes}
                </FacetValuesList>
            </Collapse>
        </div>
    );
}

const FacetListItem = styled(ListItem)({
    paddingLeft: '36px !important',
})

const FacetValueListItem= styled(ListItem)({
    paddingLeft: '46px !important',
});

const FacetValuesList= styled(List)({
    maxHeight: 340,
    overflowY: 'auto !important',
    marginRight: '18px !important'
})