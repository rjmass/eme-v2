import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Button, Tab, Tabs, Col, Row } from 'react-bootstrap';
import { tabs } from 'decorators';
import { NotFound } from 'containers';
import { sentEmailLoadActionDetailsThunk } from 'redux/modules/sentEmails';
import AnalyticsActionRecipientList from './AnalyticsActionRecipientList';
import AnalyticsActionUrlList from './AnalyticsActionUrlList';
import { Spinner } from 'components/Spinner';
import { jsonToCSV } from 'helpers/csvHelper';

const PER_PAGE = 20;

@tabs('recipients')
class AnalyticsActionDetails extends Component {

  componentDidMount() {
    const { dispatch, params: { id, action } } = this.props;
    dispatch(sentEmailLoadActionDetailsThunk(id, action));
  }

  getRecipientsPage(recipients) {
    const { params: { page = 1 } } = this.props;
    return recipients.slice(PER_PAGE * (page - 1), PER_PAGE * page);
  }

  supportedActions(name) {
    return {
      injection: {
        title: `Recipients: ${name}`,
        tabs: ['recipients']
      },
      delivery: {
        title: `Delivered: ${name}`,
        tabs: ['recipients']
      },
      open: {
        title: `Opened: ${name}`,
        tabs: ['recipients']
      },
      click: {
        title: `Clicked: ${name}`,
        tabs: ['recipients', 'urlclicks']
      },
      bounce: {
        title: `Bounced: ${name}`,
        tabs: ['recipients']
      },
      spam_complaint: {
        title: `Complained: ${name}`,
        tabs: ['recipients']
      },
      link_unsubscribe: {
        title: `Unsubscribed: ${name}`,
        tabs: ['recipients']
      }
    };
  }

  generateExport() {
    const { params: { action, id }, listActions } = this.props;
    const recipients = listActions[id] && listActions[id][action] || [];
    const data = recipients.map(recipient => ({ email: recipient }));
    const csvContent = 'data:text/csv;base64,';
    return csvContent + btoa(jsonToCSV(data));
  }

  render() {
    const { tab } = this.state;
    const { params: { action, id }, list, sentEmailActionDetailsLoading, listActions } = this.props;
    const sentEmail = list[id];
    const page = parseInt(this.props.params.page, 10) || 1;
    const emailName = sentEmail && sentEmail.name;
    const recipients = listActions[id] && listActions[id][action] || [];
    const isSpinning = !(sentEmail && listActions[id] && listActions[id][action] &&
      listActions[id][action].length) && sentEmailActionDetailsLoading;
    if (!Object.keys(this.supportedActions()).includes(action)) {
      return <NotFound />;
    }
    const actionDetails = this.supportedActions(emailName)[action];
    return (
      <div>
        <Spinner text={"Loading emails..."} isVisible={isSpinning} />
        <Row>
          <Col xs={12} className={!isSpinning ? 'show' : 'hidden'}>
            <h4>{actionDetails.title}</h4>
            <Tabs
              activeKey={tab}
              onSelect={(t) => this.handleTabSelect(t)}
              id="url-tabs"
            >
              {actionDetails.tabs.includes('recipients') &&
                <Tab eventKey="recipients" title="Recipients">
                  <div className="help-block" />
                  <a href={this.generateExport()} download={`Recipients - ${new Date()}.csv`}>
                    <Button className="btn btn-success">
                      <i className="fa fa-cloud-download" /> CSV Export
                    </Button>
                  </a>
                  <AnalyticsActionRecipientList
                    list={this.getRecipientsPage(recipients)}
                    id={id}
                    action={action}
                    totalCount={recipients.length}
                    filter={{}}
                    onFilter={() => {}}
                    page={page}
                    perPage={PER_PAGE}
                  />
                </Tab>
              }
              {actionDetails.tabs.includes('urlclicks') &&
                <Tab eventKey="urlclicks" title="URL Clicks">
                  <AnalyticsActionUrlList id={id} email={sentEmail} />
                </Tab>
              }
            </Tabs>
          </Col>
        </Row>
      </div>
    );
  }
}

@connect((state) => ({
  sentEmailActionDetailsLoading: state.sentEmails.sentEmailActionDetailsLoading,
  list: state.sentEmails.list,
  error: state.sentEmails.error,
  listActions: state.sentEmails.listActions
}))
export default class AnalyticsActionDetailsConnected extends AnalyticsActionDetails { }
