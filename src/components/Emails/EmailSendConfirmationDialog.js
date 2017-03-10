import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { sendListThunk } from 'redux/modules/send';
import { ModalDialog } from 'components/Modal';
import { notifications } from 'redux/modules/notifications';
import { substitutionLoadThunk } from 'redux/modules/substitutions';

import 'font-awesome-animation/dist/font-awesome-animation.min.css';
import './EmailSendDialog.css';

class EmailSendConfirmationDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendDisabled: false
    };
  }

  componentDidMount() {
    const { dispatch, send: { listId } } = this.props;
    dispatch(substitutionLoadThunk(listId));
  }

  async handleSendConfirm(e) {
    e.preventDefault();
    this.setState({ sendDisabled: true });
    this.props.onHide();
    const { listId, startTime } = this.props.send;
    const { email, id, dispatch } = this.props;
    dispatch(notifications.info(
      <span>
        <i className="fa fa-envelope-o faa-passing animated" />
        &nbsp; &nbsp; Sending
      </span>
    ));
    return await dispatch(
      sendListThunk({
        id,
        name: email.name,
        campaignId: email.campaign,
        recipients: { list_id: listId },
        startTime
      }));
  }

  render() {
    const { substitutions, email, send: { listId } } = this.props;
    const list = substitutions.list[listId] || {};
    const data = list.data || [];

    const { show, onHide } = this.props;
    return (
      <ModalDialog
        show={show}
        onHide={onHide}
        title={'Confirm Send'}
        text={data.length ?
          <div>
            <strong>Email Name:</strong> {email.name}<br></br>
            <strong>List Name:</strong> {list.name}<br></br>
            <strong>No. of Recipients:</strong> {data.length}<br></br>
            <div className="help-block"></div>
            Click confirm to send
          </div> : 'Loading send data...'}
        buttons={[
          <Button key={'cancel'} onClick={() => this.props.onHide()}>Cancel</Button>,
          <Button
            key={'confirm'}
            bsStyle="primary"
            onClick={(e) => this.handleSendConfirm(e)}
            disabled={!data.length || this.sendDisabled}
          >
            Confirm
          </Button>
        ]}
      />
    );
  }
}

@connect((state) => ({ substitutions: state.substitutions, send: state.send }))
export default class ConnectedEmailSendConfirmationDialog extends EmailSendConfirmationDialog {}
