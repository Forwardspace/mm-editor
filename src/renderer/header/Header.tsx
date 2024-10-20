import { Nav, Container, Button} from 'react-bootstrap';
import './header.css'
import React from 'react';
import { useSnapshot } from 'valtio';
import { actions, meta } from '../state';

import { saveFile } from '../serializer/serializer.tsx';
import { loadFile } from '../serializer/deserializer.tsx';

export function Header() {
    var meta_reactive = useSnapshot(meta);

    return (
        <Nav activeKey="rule">
            <Container className="nav-tabs" id="nav-tab-container">
                <Nav.Item>
                    <input type="text" value={meta_reactive.name} className="name-input" onChange={(ev) => { meta.name = ev.target.value }} />
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="rule">Rule</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="setting">Setting</Nav.Link>
                </Nav.Item>
                <Container className="right-aligned" id="tab-container-right">
                    <Nav.Item>
                        <Button className="nav-button save" onClick={ saveFile }><i className="las la-save"></i></Button>
                    </Nav.Item>
                    <Nav.Item>
                        <Button className="nav-button load" onClick={ loadFile }><i className="las la-folder-open"></i></Button>
                    </Nav.Item>
                    <Nav.Item>
                        <Button className="nav-button delete" onClick={ () => {actions.length = 0} } ><i className="las la-trash"></i></Button>
                    </Nav.Item>
                </Container>
            </Container>
        </Nav>
    );
}