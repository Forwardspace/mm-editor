import React from "react";
import { Button, Card } from "react-bootstrap";

export function TagGroup(props) {
    if (props.contents.tags.length == 0) {
        return (
            <Button className="add-new-button" onClick={() => {
                    props.passdown.tags.push("<enter tag name>");
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
                        <div className="display-inline">
                            <p>
                                Tag
                                <input 
                                    type="text" 
                                    className="wide spaced" 
                                    value={tag}
                                    onChange={(ev) => {
                                        props.passdown.tags[idx] = ev.target.value
                                    }}
                                />
                            </p>
                            <Button className="delete-button-inline" onClick={deleteTag.bind(this, idx)}>delete</Button>
                        </div>
                    ))
                }
            <Button className="add-new-button" onClick={() => {
                    props.passdown.tags.push("<enter tag name>");
                }}>Add new tag
            </Button>
            </Card.Body>
        </Card>
    );
}