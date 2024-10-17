import React from 'react';

import './selector.css';
import { actions, modalData } from '../../state';

import { Button, Card, Dropdown, DropdownButton, Tab, Tabs } from 'react-bootstrap';

function getNestedSelectorHeader(props) {
    switch (props.contents.type) {
        case "players":
            return (<h3>among all players...</h3>);
        case "tags":
            return (<h3>among all tags...</h3>);
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
        case "chance":
            return (
                <h3>
                    with a chance of  
                    <input 
                        type="text" 
                        className="spaced"
                        value={props.contents.val} 
                        onChange={(ev) => {
                            props.passdown.val = ev.target.value
                        }}
                    /> 
                    :
                </h3>);
        case "extract":
            return (
                <div className="display-inline">
                    <h3>from</h3>
                    <DropdownButton title={props.contents.from}>
                        <Dropdown.Item onClick={() => { props.passdown.from = "players" }}>players</Dropdown.Item>
                        <Dropdown.Item onClick={() => { props.passdown.from = "tags" }}>tags</Dropdown.Item>
                    </DropdownButton>
                    <h3>extract</h3>
                    <DropdownButton title={props.contents.extract}>
                        <Dropdown.Item onClick={() => { props.passdown.extract = "players" }}>players</Dropdown.Item>
                        <Dropdown.Item onClick={() => { props.passdown.extract = "tags" }}>tags</Dropdown.Item>
                    </DropdownButton>
                    { props.contents.extract == "tags" && (
                        <React.Fragment>
                            <h3>with type: </h3>
                            <input
                                className="wide spaced" 
                                type="text" 
                                value={props.contents.val} 
                                onChange={(ev) => { props.passdown.val = ev.target.value }} 
                            />
                        </React.Fragment>
                    )}
                </div>)
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

    // Make sure not to allow more user to select more domain selectors
    var childAllow = (props.allow[0] == "Domain")? props.allow.slice(1) : props.allow.slice();

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
                            allow={childAllow} 
                            contents={selector} 
                            passdown={props.passdown.selector[idx]} 
                            onChange={onChange.bind(this, idx)} 
                        />
                    )) : <p>(no selectors)</p>
                }
                <Button className="add-new-button" onClick={() => {
                    openAddNewSelectorModal(onChange.bind(this, -1), childAllow) 
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
                    {props.basic? "There is a player/tag with the tag" : "Any player/tag with the tag"}
                    <input 
                        type="text" 
                        className="wide spaced" 
                        value={ props.contents.val } 
                        onChange={(ev) => { props.passdown.val = ev.target.value }}
                    />
                </p>;
            break;
        case "tag_group":
            terminal =
            <p>
                Select all tags from tag group
                <input 
                        type="text" 
                        className="wide spaced" 
                        value={ props.contents.val } 
                        onChange={(ev) => { props.passdown.val = ev.target.value }}
                />
            </p>
            break;
        case "current_player":
            terminal = <p><b>Select the current player</b></p>
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
        case "tags":
        case "union":
        case "intersection":
        case "not":
        case "random":
        case "chance":
        case "extract":
            return renderNestedSelector(props);
        case "has_type":
        case "all":
        case "current_player":
        case "tag_group":
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
        case "tag_group":
            return {type: t, val: "<write group name here>"}
        case "players":
        case "tags":
            return {type: t, selector: []};
        case "extract":
            return {type: t, from: "players", extract: "tags", selector: []}
        case "chance":
            return {type: t, val: "50%", selector: []};
        case "random":
            return { type: t, val: "1", selector: [{ type: "all" }] };
        case "all":
        case "current_player":
            return { type: t };
    }
}

function openAddNewSelectorModal(onChange, allow:any=null) {
    var options = [
        {title: "Domain", contents: [
            {type: "players", header: "Players", text: "Select among all players in the game"},
            {type: "tags", header: "Tags", text: "Select among all tags in the game"},
        ]},
        {title: "Terminal", contents: [
            {type: "has_type", header: "Has Type", text: "Checks if a person (or tag, depends on context) has a tag of a certain name"},
            {type: "current_player", header: "Current Player", text: "Current player that's being assigned tags (only used in Assign action)"},
            {type: "all", header: "All", text: "Select all valid targets in the domain"},
            {type: "tag_group", header: "Tag Group", text: "Select among tags in a specified tag group"}
        ]},
        {title: "Combinatory", contents: [
            {type: "union", header: "Union", text: "Logical 'or' operator. Used to combine results of selectors inside it"},
            {type: "intersection", header: "Intersection", text: "Logical 'and' operator. Returns only the values that are common to all selectors inside it"},
            {type: "not", header: "Not", text: "Logical 'not' operator. Returns every value except what is inside it"},
        ]},
        {title: "Filters", contents: [
            {type: "extract", header: "Extract Parameter", text: "Takes the targets and returns the parameters"},
            {type: "random", header: "Random", text: "Used to randomly select between targets with a specified frequency"},
            {type: "chance", header: "Chance", text: "Assign a percentage likelihood to what's inside it"},
        ]}
    ];

    if (allow != null && allow.length > 0 && allow[0] == "Domain") {
        // Only show Domain category first
        options.splice(1);
    }
    else if (allow != null && allow.length > 0) {
        options = options.filter((cat, idx) => {
            return (allow.indexOf(cat.title) != -1);
        })
    }

    if (allow.length == 0) {
        // Remove Domain category unless it's explicitly allowed
        options.splice(0, 1);
    }

    modalData.contents = (
        <Tabs>
            {options.map((category) => (
                <Tab transition={false} eventKey={category.title} title={category.title}>
                    {category.contents.map((selector) => (
                        <Card className="selector-card sc-button" onClick={() => { onChange(getNewSelectorOfType(selector.type)); modalData.show = false; }}>
                        <Card.Header><h3>{selector.header}</h3></Card.Header>
                        <Card.Body>
                            <p>{selector.text}</p>
                        </Card.Body>
                    </Card>
                    ))}
                </Tab>
            ))}
        </Tabs>
    );

    modalData.show = true;
}

export function Selector(props) {
    if (props.contents == null) {
        // Display an add new button only if there's no selector yet
        return (
            <Button className="add-new-button" onClick={ () => openAddNewSelectorModal(props.onChange, props.allow) }>Add new selector</Button>
        );
    }

    return renderSelectorBody(props, true);
}