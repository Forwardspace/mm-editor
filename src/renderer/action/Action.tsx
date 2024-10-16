import React from 'react';
import { Button, Card } from 'react-bootstrap';

import { DomainSelector } from './selector/Selector.tsx';

import './action.css'
import { actions, modalData } from '../state.tsx';
import { RuleGroup } from './rulegroup/RuleGroup.jsx';
import { TagGroup } from './taggroup/TagGroup.tsx';
import { HandoutTextArea } from './handouttextarea/HandoutTextArea.tsx';

function getHeader(props, passdown) {
    switch (props.contents.type) {
        case "requirement":
            return (<h3>Requires...</h3>);
        case "activate":
            return (<h3>Activates...</h3>);
        case "assign":
            return (<h3>
                        Assigns... 
                        <span className="spaced">
                            (same value
                            <input 
                                type="checkbox"
                                className="input-short input-big"
                                onChange={(ev) => { passdown.together = ev.target.checked }} 
                            />
                            )
                        </span>
                    </h3>);
        case "handout":
            return (<h3>Hands out to players...</h3>);
        case "tag_group":
            return (<h3>Defines tag group...</h3>);
        default:
            return (<h3>(unknown type)</h3>);
    }
}

function getBackgroundColor(type) {
    switch (type) {
        case "requirement":
            return { backgroundColor: "#2d1919" };
        case "activate":
            return { backgroundColor: "#50501e" };
        case "assign":
            return { backgroundColor: "#193c19" };
        case "handout":
            return { backgroundColor: "#191941" };
        case "tag_group":
            return { backgroundColor: "#4eb5b2" };
        default:
            return { backgroundColor: "#000000" };
    }
}

function renderRequirementBody(contents, action) {
    // Requirement contains just a nested selector
    return (<DomainSelector basic={true} contents={contents.selector} passdown={action.selector} onChange={ (sel) => { action.selector = sel } } />);
}

function renderActivateBody(contents, action) {
    return (<RuleGroup contents={contents.rules} passdown={action.rules} />);
}

function renderAssignBody(contents, action) {
    return (
        <React.Fragment>
            <DomainSelector basic={false} contents={contents.selector} passdown={action.selector}  onChange={ (sel) => { action.selector = sel } } />
            <hr/>
            <TagGroup contents={contents} passdown={action} />
        </React.Fragment>
    );
}

function renderHandoutBody(contents, action) {
    return (
        <React.Fragment>
            <DomainSelector basic={false} contents={contents.selector} passdown={action.selector}  onChange={ (sel) => { action.selector = sel } } />
            <hr />
            <HandoutTextArea contents={contents} passdown={contents} onChange={ (text) => { action.text = text; } } />
        </React.Fragment>
    );
}

function renderCardBody(contents, action) {
    switch (contents.type) {
        case "requirement":
            return renderRequirementBody(contents, action);
        case "activate":
            return renderActivateBody(contents, action);
        case "assign":
            return renderAssignBody(contents, action);
        case "handout":
            return renderHandoutBody(contents, action);
        default:
            return (<p>Unknown card type</p>);
    }
}

function addNewAction(t) {
    let data;

    switch (t) {
        case "requirement":
            data = { type: t, selector: null };
            break;
        case "activate":
            data = { type: t, rules: [] };
            break;
        case "assign":
            data = { type: t, together: false, selector: null, tags: []};
            break;
        case "handout":
            data = { type: t, selector: null, text: "" };
            break;
        case "tag_group":
            data = { type: t, name: "", tags: [] };
            break;
        default:
            return null;
    }

    if (actions.length == 0) {
        data.id = 0;
        actions.push(data);
        return;
    }

    data.id = actions[actions.length - 1].id + 1;
    actions.push(data);
}

export function openAddNewActionModal(limit="rule") {
    modalData.title = "New action";
    if (limit == "rule") {
        modalData.contents = (
            <div>
                <Card style={ getBackgroundColor("requirement") } onClick={() => { addNewAction("requirement"); modalData.show = false; }}>
                    <Card.Header><h3>Requirement</h3></Card.Header>
                    <Card.Body>
                        <p>Requires that all conditions inside it be true for the rule to run.</p>
                    </Card.Body>
                </Card>
                <Card style={ getBackgroundColor("activate") } onClick={() => { addNewAction("activate"); modalData.show = false; }}>
                    <Card.Header><h3>Activate</h3></Card.Header>
                    <Card.Body>
                        <p>Runs one or more other rules</p>
                    </Card.Body>
                </Card>
                <Card style={ getBackgroundColor("assign") } onClick={() => { addNewAction("assign"); modalData.show = false; }}>
                    <Card.Header><h3>Assign</h3></Card.Header>
                    <Card.Body>
                        <p>Assigns one or more tags to one or more specific people</p>
                    </Card.Body>
                </Card>
                <Card style={ getBackgroundColor("handout") } onClick={() => { addNewAction("handout"); modalData.show = false; }}>
                    <Card.Header><h3>Handout</h3></Card.Header>
                    <Card.Body>
                        <p>Gives visible text to one or more specific people</p>
                    </Card.Body>
                </Card>
            </div>
        );
    }
    else if (limit == "setting") {
        modalData.contents = (
            <div>
                <Card style={ getBackgroundColor("activate") } onClick={() => { addNewAction("activate"); modalData.show = false; }}>
                    <Card.Header><h3>Activate</h3></Card.Header>
                    <Card.Body>
                        <p>Runs one or more other rules</p>
                    </Card.Body>
                </Card>
                <Card style={ getBackgroundColor("tag_group") } onClick={() => { addNewAction("tag_group"); modalData.show = false; }}>
                    <Card.Header><h3>Tag Group</h3></Card.Header>
                    <Card.Body>
                        <p>Defines a group of predefined tags for use later</p>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    modalData.show = true;
}

export function Action(props) {
    // Limit children to only a relevant subset of the global state
    // In this case, give them only this specific action
    var passdown = props.actions[props.actions.indexOf(props.actions.find((action) => { return action.id == props.contents.id }))];

    return (
        <Card className="action">
            <Card.Header style={ getBackgroundColor(props.contents.type) }>
                { getHeader(props, passdown) }
                <Button className="delete-button" onClick={() => {
                    var idx = props.actions.indexOf(props.actions.find((action) => { return action.id == props.contents.id }));
                    props.actions.splice(idx, 1);
                }}>
                    delete
                </Button>
            </Card.Header>
            <Card.Body>
            { renderCardBody(props.contents, passdown) }
            </Card.Body>
        </Card>
    );
}