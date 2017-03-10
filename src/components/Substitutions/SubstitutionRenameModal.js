import React, { Component } from 'react';
import { Modal, Form, FormControl, FormGroup, ControlLabel, Button } from 'react-bootstrap';

export default class SubstitutionRenameModal extends Component {

  constructor(...params) {
    super(...params);
    this.state = {
      newKey: ''
    };
  }

  get sendDisabled() {
    const { newKey } = this.state;
    return !newKey.length;
  }

  handleHide() {
    this.setState({ newKey: '' });
    this.props.onHide();
  }

  handleConfirm(columnKey, newKey) {
    this.props.onConfirm(columnKey, newKey);
    this.setState({ newKey: '' });
  }

  handleChange(event) {
    this.setState({ newKey: event.target.value });
  }

  render() {
    const { show, selectedColumn: { columnKey } } = this.props;
    return (
      <Modal show={show} onHide={() => this.handleHide()}>
        <Modal.Header closeButton>
          <Modal.Title>Rename Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={event => event.preventDefault()}>
            <FormGroup controlId="renameText">
              <ControlLabel>Property Name:</ControlLabel>
              <FormControl
                type="text"
                onChange={event => this.handleChange(event)}
                placeholder="Enter new name"
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button key={1} onClick={() => this.handleHide()}>Cancel</Button>
          <Button
            key={2}
            bsStyle="primary"
            onClick={() => this.handleConfirm(columnKey, this.state.newKey)}
            disabled={this.sendDisabled}
          >
            Rename
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
