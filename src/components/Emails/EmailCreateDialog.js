import { connect } from 'react-redux';
import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { TemplatePicker } from 'components/Templates';
import { createEmailFromTemplateThunk } from 'redux/modules/emails';
import { Modal, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import config from 'config';

@connect()
export default class EmailCreateDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateId: null,
    };
  }

  async handleCreateEmail(event) {
    event.preventDefault();
    this.props.onHide();
    const { dispatch } = this.props;
    const { templateId } = this.state;
    const email = await dispatch(createEmailFromTemplateThunk(templateId));
    dispatch(push(`${config.urlInfix}/emails/${email._id}`));
  }

  get createDisabled() {
    const { templateId } = this.state;
    return !templateId;
  }

  render() {
    const { show, onHide } = this.props;
    return (
      <Modal show={show} onHide={onHide}>
        <Form onSubmit={(e) => this.handleSendPreviewConfirm(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Create Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup controlId="emailText">
              <ControlLabel>From Template:</ControlLabel>
              <TemplatePicker
                value={this.state.templateId}
                onSelect={(templateId) => this.setState({ templateId })}
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button
              key={'cancel'}
              onClick={() => onHide()}
            >Cancel</Button>
            <Button
              type="submit"
              key={'confirm'}
              bsStyle="primary"
              onClick={(e) => this.handleCreateEmail(e)}
              disabled={this.createDisabled}
            >
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}
