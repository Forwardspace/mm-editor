import './rulegroup.css'
import '../selector/selector.css'
import { Card, Button } from 'react-bootstrap'

export function RuleGroup(props) {
    function deleteRule(idx) {
        props.passdown.splice(idx, 1);
    }

    return (
        <Card className="selector-card">
            <Card.Header className="display-inline">
                <h3>these rules:</h3>
            </Card.Header>
            <Card.Body>
                {
                    props.contents.map((rule, idx) => (
                        <div className="display-inline">
                            <p><b>{rule}</b></p>
                            <Button className="delete-button-inline" onClick={deleteRule.bind(this, idx)}>delete</Button>
                        </div>
                    ))
                }
                <Button className="add-new-button" onClick={() => props.passdown.push("<write name here>")}>Add new rule</Button>
            </Card.Body>
        </Card>
    );
}