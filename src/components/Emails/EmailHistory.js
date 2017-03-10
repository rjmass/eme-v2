import React, { Component, PropTypes } from 'react';
import { Panel } from 'react-bootstrap';
import { sentEmailsLoadThunk, getSentEmails } from 'redux/modules/sentEmails';
import { scheduledEmailsLoadThunk, getScheduledEmails } from 'redux/modules/scheduledEmails';
import EmailHistoryList from './EmailHistoryList';
import { createSelector } from 'reselect';
import { Message } from 'components/Message';
import { connect } from 'react-redux';
import { pager } from 'decorators';

import './EmailPanel.css';

const sentEmailSelector = createSelector(
  props => props.sentList,
  props => props.parentEmailId,
  (sentEmails, parentEmailId) => {
    return sentEmails.filter(sentEmail => sentEmail.parentEmailId === parentEmailId);
  }
);

const scheduledEmailSelector = createSelector(
  props => props.scheduledList,
  props => props.parentEmailId,
  (scheduledEmails, parentEmailId) => {
    return scheduledEmails.filter((scheduledEmail) => scheduledEmail.name === parentEmailId);
  }
);

@pager(5)
export class EmailHistory extends Component {
  static propTypes = {
    parentEmailId: PropTypes.string.isRequired
  }

  componentDidMount() {
    this.fetchSentEmails();
    this.fetchScheduledEmails();
  }

  fetchSentEmails() {
    const { dispatch } = this.props;
    dispatch(sentEmailsLoadThunk());
  }

  fetchScheduledEmails() {
    const { dispatch } = this.props;
    dispatch(scheduledEmailsLoadThunk());
  }

  render() {
    const sentEmails = sentEmailSelector(this.props);
    const scheduledEmails = scheduledEmailSelector(this.props);
    const { page, pageSize } = this.state;
    const allEmails = [...scheduledEmails, ...sentEmails];

    return (
      <Panel collapsible header={`Transmissions (${allEmails.length})`}>
        {!allEmails.length ?
          <Message type="info" text="This email has never been sent" /> :
          <EmailHistoryList
            page={page}
            perPage={pageSize}
            totalCount={allEmails.length}
            list={this.getCurrentPageList(allEmails)}
            onPageChange={(p) => this.handlePageChange(p)}
          />}
      </Panel>
    );
  }
}

@connect(state => ({
  sentList: getSentEmails(state.sentEmails),
  scheduledList: getScheduledEmails(state.scheduledEmails)
}))
export default class EmailHistoryConnected extends EmailHistory { }
