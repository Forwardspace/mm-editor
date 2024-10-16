import React from "react";
import { Card } from "react-bootstrap"

export function HandoutTextArea(props) {
    return (
        <Card className="selector-card">
            <Card.Header>
                <h3>give them this text:</h3>
            </Card.Header>
            <Card.Body>
                <textarea value={props.contents.text} onChange={(ev) => { props.onChange(ev.target.value) }} />
            </Card.Body>
        </Card>
    );
}