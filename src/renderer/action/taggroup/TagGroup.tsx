import React from "react";
import { Button, Card } from "react-bootstrap";

import './taggroup.css'
import { Selector } from "../selector/Selector";

export function Tag(props) {
    if (!props.containsData) {
        return (
            <div className="display-inline justify-left">
                <h4>
                    Tag
                </h4>
                <input 
                    type="text" 
                    className="wide spaced" 
                    value={props.contents.val}
                    onChange={(ev) => {
                        props.passdown.val = ev.target.value
                    }}
                />
                <Button className="attach-button-absolute" onClick={() => {
                    props.passdown.containsData = true;
                }}>
                    Attach parameter
                </Button>
                <Button
                    className="delete-button-inline delete-button-absolute"
                    onClick={props.onDelete}
                >
                    delete
                </Button>
            </div>
        )
    }
    else {
        return (
            <Card className="selector-card">
                <Card.Header>
                    <div className="display-inline">
                        <h4>Tag '{props.contents.val}' with parameter:</h4>
                        <Button className="attach-button-absolute" onClick={() => {
                            props.passdown.containsData = false;
                        }}>
                            Remove parameter
                        </Button>
                        <Button
                            className="delete-button-inline delete-button-absolute"
                            onClick={props.onDelete}
                        >
                            delete
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Selector allow={["Domain"]} contents={props.contents.selector} passdown={props.passdown.selector}  onChange={ (sel) => { props.passdown.selector = sel } } />
                </Card.Body>
            </Card>
        )
    }
}

export function TagGroup(props) {
    if (props.contents.tags.length == 0) {
        return (
            <Button className="add-new-button" onClick={() => {
                    props.passdown.tags.push({ containsData: false, val: "(enter tag here)", selector: null });
            }}>Add new tag
            </Button>
        );
    }

    function deleteTag(idx) {
        props.passdown.tags.splice(idx, 1);
    }

    return (
        <Card className="selector-card">
            <Card.Header>
                <h3>these tags...</h3>
            </Card.Header>
            <Card.Body>
                {
                    props.contents.tags.map((tag, idx) => (
                        <Tag containsData={tag.containsData} passdown={props.passdown.tags[idx]} contents={tag} onDelete={deleteTag.bind(this, idx)} />
                    ))
                }
            <Button className="add-new-button" onClick={() => {
                    props.passdown.tags.push({ containsData: false, val: "(enter tag here)", selector: null });
                }}>Add new tag
            </Button>
            </Card.Body>
        </Card>
    );
}