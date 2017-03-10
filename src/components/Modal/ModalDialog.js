import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

export default class ModalDialog extends Component {
  render() {
    const { show, onHide, buttons = [], text, title = 'warning' } = this.props;
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {text}
        </Modal.Body>

        <Modal.Footer>
          {buttons}
        </Modal.Footer>
      </Modal>
    );
  }
}
