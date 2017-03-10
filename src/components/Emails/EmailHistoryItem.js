import React, { Component, PropTypes } from 'react';
import { ListGroupItem, Badge, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import moment from 'moment';
import config from 'config';
import { scheduledEmailDeleteThunk } from 'redux/modules/scheduledEmails';
import { connect } from 'react-redux';
import EmailConfirmCancelScheduledDialog from './EmailConfirmCancelScheduledDialog';
import { dialogs } from 'decorators';

@connect()
@dialogs()
export default class EmailHistoryItem extends Component {
  static propTypes = {
    email: PropTypes.object.isRequired
  }

  handleDeleteClick = (id) => {
    const { dispatch } = this.props;
    this.closeDialog('cancelSchedule');
    dispatch(scheduledEmailDeleteThunk(id));
  }

  render() {
    const { email } = this.props;

    const tooltip = (text) => (
      <Tooltip id="text">
       {text}
      </Tooltip>
    );

    const renderScheduledItem = (e) => (
      <ListGroupItem key={e.id}>
        <EmailConfirmCancelScheduledDialog
          show={this.state.dialogs.cancelSchedule}
          onCancel={() => this.closeDialog('cancelSchedule')}
          onConfirm={() => this.handleDeleteClick(e.id)}
        />
        <OverlayTrigger
          placement="top"
          overlay={tooltip(moment(e.start_time).format('LLLL'))}
        >
          <span>Scheduled {moment(e.start_time).fromNow()}</span>
        </OverlayTrigger>
        <Button
          bsStyle="danger"
          bsSize="xsmall"
          className="pull-right"
          onClick={() => this.openDialog('cancelSchedule')}
        >Cancel</Button>
      </ListGroupItem>
    );

    const renderSentItem = (e) => (
      <ListGroupItem key={e._id}>
        <OverlayTrigger
          placement="top"
          overlay={tooltip(moment(e.sentDate).format('LLLL'))}
        >
          <Link to={`${config.urlInfix}/analytics/emails/${e.emailId}`}>
              Sent {moment(e.sentDate).fromNow()}
          </Link>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={tooltip('Number of recipients')}>
          <Badge pullRight style={{ backgroundColor: '#5bc0de' }} >
            {e.analytics.injection.toLocaleString()}
          </Badge>
        </OverlayTrigger>
      </ListGroupItem>
      );

    return email.start_time ?
      renderScheduledItem(email) :
      renderSentItem(email);
  }
}
