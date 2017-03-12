import React, { Component } from 'react';
import TagsInput from 'react-tagsinput';
import AutosizeInput from 'react-input-autosize';
import { connect } from 'react-redux';
import { Modal, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { sendEmailPreviewThunk } from 'redux/modules/send';
import { notifications } from 'redux/modules/notifications';
import { Message } from 'components/Message';
import some from 'lodash/some/';
import store from 'store';

import './EmailSendPreview.css';

// eslint-disable-next-line
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
const storeKey = 'meme-preview-dialog-emails';

class EmailSendPreviewDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emails: store.get(storeKey) || []
    };
  }

  handleEmailChange(emails) {
    store.set(storeKey, emails);
    this.setState({ emails });
  }

  async handleSendPreviewConfirm(e) {
    e.preventDefault();
    this.props.onHide();
    const { id, dispatch } = this.props;
    const { emails } = this.state;
    dispatch(notifications.info(
      <span><i className="fa fa-envelope-o faa-passing animated" />&nbsp;&nbsp;Sending</span>
    ));
    const recipients = emails.map((email) => {
      return {
        address: {
          email
        }
      };
    });
    return await dispatch(sendEmailPreviewThunk(id, recipients));
  }

  get sendDisabled() {
    const { emails } = this.state;
    return !emails.length || !this.areEmailsInSelectedList();
  }

  render() {
    function autosizingRenderInput(props) {
      const { onChange, value, ...other } = props;
      return (
        <AutosizeInput
          type="text"
          onChange={onChange}
          value={value}
          {...other}
        />
      );
    }
    const { show, onHide } = this.props;
    const { listId } = this.state;
    return (
      <Modal show={show} onHide={onHide}>
        <Form onSubmit={(e) => this.handleSendPreviewConfirm(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Send Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup controlId="emailText">
              <ControlLabel>Email Addresses:</ControlLabel>
              <TagsInput
                renderInput={autosizingRenderInput}
                onlyUnique
                addOnPaste
                validationRegex={emailRegex}
                addKeys={[9, 13, 32, 188, 186]/* tab, enter, space, comma, semi-colon */}
                value={this.state.emails}
                placeholder="Recipient Email Addresses"
                onChange={(emails) => this.handleEmailChange(emails)}
                inputProps={{ placeholder: 'Add email address' }}
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button key={'cancel'} onClick={() => this.props.onHide()}>Cancel</Button>
            <Button
              type="submit"
              key={'confirm'}
              bsStyle="primary"
              disabled={this.sendDisabled}
            >
              Send
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default class ConnectedEmailSendPreviewDialog extends EmailSendPreviewDialog {}
