
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { CampaignPicker } from 'components/Campaigns';
import { Modal, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { emailUpdateThunk } from 'redux/modules/emails';

@connect()
export default class EmailLabelDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignId: null
    };
  }

  handleCampaignSelect(campaignId) {
    this.setState({ campaignId });
  }

  handleLabelEmails(e) {
    e.preventDefault();
    const { dispatch, emailIds, onHide, onRelabel } = this.props;
    emailIds.map(emailId =>
      dispatch(emailUpdateThunk(emailId, { campaign: this.state.campaignId }))
    );
    onHide();
    onRelabel();
  }

  render() {
    const { show, onHide } = this.props;
    return (
      <Modal show={show} onHide={onHide}>
        <Form onSubmit={(e) => this.handleSendPreviewConfirm(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Relabel Email</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <FormGroup controlId="emailText">
              <ControlLabel>Campaign:</ControlLabel>
              <CampaignPicker
                value={this.state.campaignId}
                onSelect={(option) => this.handleCampaignSelect(option)}
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
              onClick={(e) => this.handleLabelEmails(e)}
              disabled={this.createDisabled}
            >
              Relabel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}
