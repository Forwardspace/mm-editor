import React from 'react';
import { Modal, ModalHeader } from 'react-bootstrap';

import { useSnapshot } from 'valtio';

import { Action, openAddNewActionModal } from '../action/Action.tsx';
import { actions, modalData } from '../state.tsx'

import './cardlist.css'

export function CardList() {
    const actions_reactive = useSnapshot(actions);
    const modalData_reactive = useSnapshot(modalData);

    return (
        <div className="card-container" id="cardcontainer">
            {
                actions_reactive.map(action_reactive => (
                    <Action contents={action_reactive} actions={actions} />
                ))
            }

            <div id="add-new-container">
                <button className="btn add-new-btn" id="add-new-button" onClick={() => openAddNewActionModal()}>Add new action</button>
            </div>

            <Modal show={modalData_reactive.show}>
                <Modal.Header>
                    <Modal.Title>{modalData_reactive.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalData_reactive.contents}
                </Modal.Body>
            </Modal>
        </div>
    );
}