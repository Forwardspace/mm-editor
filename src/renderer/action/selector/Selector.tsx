import React from 'react';

import './selector.css';
import { actions, modalData } from '../../state';

import { Button, Card } from 'react-bootstrap';

function getNestedSelectorHeader(props) {
    switch (props.contents.type) {
        case "players":
            return (<h3>among all players...</h3>);
        case "union":
            return (<h3>any of this needs to be true:</h3>);
        case "intersection":
            return (<h3>all of this needs to be true:</h3>);
        case "not":
            return (props.basic? (<h3>none of this can be true:</h3>) : (<h3>except these:</h3>));
        case "random":
            return (
                <h3>
                    select 
                    <input 
                        type="text" 
                        className="spaced"
                        value={props.contents.val} 
                        onChange={(ev) => {
                            props.passdown.val = ev.target.value
                        }}
                    /> 
                    of these targets randomly:
                </h3>);
        default:
            return (<h3>(unknown nested selector type)</h3>);
    }
}

function renderNestedSelector(props) {
    function onChange(idx, newSelector) {
        if (idx == -1) {
            props.passdown.selector.push(newSelector);
        }

        if (newSelector == null) {
            props.passdown.selector.splice(idx, 1);
        }
        else {
            props.passdown.selector[idx] = newSelector;
        }
    }

    return (
        <Card className="selector-card">
            <Card.Header className="display-inline">
                { getNestedSelectorHeader(props) }
                <Button className="delete-button-inline" onClick={() => props.onChange(null)}>delete</Button>
            </Card.Header>
            <Card.Body>
                {
                    props.contents.selector? props.contents.selector.map((selector, idx) => (
                        <Selector 
                            basic={props.basic} 
                            contents={selector} 
                            passdown={props.passdown.selector[idx]} 
                            onChange={onChange.bind(this, idx)} 
                        />
                    )) : <p>(no selectors)</p>
                }
                <Button className="add-new-button" onClick={() => {
                    openAddNewSelectorModal(onChange.bind(this, -1), props.basic? "basic" : "none") 
                }}>Add new selector
                </Button>
            </Card.Body>
        </Card>
    );
}

function renderTerminal(props) {
    let terminal;

    switch (props.contents.type) {
        case "has_type":
            terminal = 
                <p>
                    {props.basic? "There is a player with the tag" : "Any player with the tag"}
                    <input 
                        type="text" 
                        className="wide spaced" 
                        value={ props.contents.val } 
                        onChange={(ev) => { props.passdown.val = ev.target.value }}
                    />
                </p>;
            break;
        case "all":
            terminal = <p><b>Select all valid targets</b></p>;
            break;
    }

    return (
        // Add a delete button on the right side
        <div className="display-inline">
            { terminal } <Button className="delete-button-inline" onClick={ () => {
                if (!Array.isArray(props.passdown.selector)) {
                    props.onChange(null);
                    return;
                }

                if (props.contents.val) {
                    var idx = props.passdown.selector.indexOf(props.passdown.selector.find((obj) => obj.val == props.contents.val));
                    props.passdown.selector.splice(idx, 1);
                }
                else {
                    var idx = props.passdown.selector.indexOf(props.contents);
                    props.passdown.selector.splice(idx, 1);
                }
            } }>delete</Button>
        </div>
    );
}

function renderSelectorBody(props, isBasic) {
    switch (props.contents.type) {
        case "players":
        case "union":
        case "intersection":
        case "not":
        case "random":
            return renderNestedSelector(props);
        case "has_type":
        case "all":
            return renderTerminal(props);
        default:
            return (<p>Unknown selector type :: { JSON.stringify(props.contents) }</p>)
    }
}

function getNewSelectorOfType(t) {
    switch (t) {
        case "union":
        case "intersection":
        case "not":
            return {type: t, selector: []};
        case "has_type":
            return {type: t, val: "<write tag here>"};
        case "players":
            return {type: t, selector: []};
        case "random":
            return { type: t, val: "1", selector: [{ type: "all" }] };
        case "all":
            return { type: t };
    }
}

function openAddNewSelectorModal(onChange, limit="none") {
    var options = [
        {type: "players", header: "Players", text: "Select among all players in the game"},
        {type: "has_type", header: "Has Type", text: "Checks if a person has a tag of a certain name"},
        {type: "union", header: "Union", text: "Logical 'or' operator. Used to combine results of selectors inside it."},
        {type: "intersection", header: "Intersection", text: "Logical 'and' operator. Returns only the values that are common to all selectors inside it."},
        {type: "not", header: "Not", text: "Logical 'not' operator. Returns every value except what is inside it."},
        {type: "random", header: "Randomization", text: "Used to randomly select between targets with a specified frequency"},
        {type: "all", header: "All", text: "Select all valid targets in the domain"},
    ];

    // Leave either only domain or non-domain selectors
    if (limit.includes("domain")) {
        options.splice(1);
        modalData.title = "Add domain selector";
    }
    else {
        options.splice(0, 1);
        modalData.title = "Add selector";
    }

    if (limit.includes("basic") && !limit.includes("domain")) {
        // Remove advanced selectors
        options.splice(options.length - 2, 2);
    }

    modalData.contents = options.map((option) => (
        <Card className="selector-card sc-button" onClick={() => { onChange(getNewSelectorOfType(option.type)); modalData.show = false; }}>
            <Card.Header><h3>{option.header}</h3></Card.Header>
            <Card.Body>
                <p>{option.text}</p>
            </Card.Body>
        </Card>
    ))

    modalData.show = true;
}

export function Selector(props) {
    if (props.contents == null) {
        // Display an add new button only if there's no selector yet
        return (
            <Button className="add-new-button" onClick={ () => openAddNewSelectorModal(props.onChange, props.basic? "basic" : "none") }>Add new selector</Button>
        );
    }

    return renderSelectorBody(props, true);
}

export function DomainSelector(props) {
    if (props.contents == null) {
        // Same as normal selector except limited to domain selectors only
        return (
            <Button className="add-new-button" onClick={ () => openAddNewSelectorModal(props.onChange, props.basic? "basic domain" : "domain") }>Add new domain selector</Button>
        );
    }

    return renderSelectorBody(props, true);
}