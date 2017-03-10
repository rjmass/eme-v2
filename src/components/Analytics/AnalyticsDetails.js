import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { sentEmailLoadThunk } from 'redux/modules/sentEmails';
import { Spinner } from 'components/Spinner';
import AnalyticsTimeLineGraph from './AnalyticsTimeLineGraph';
import { Row, Col, Tab, Tabs, Badge } from 'react-bootstrap';
import { BaseComponent } from 'components/Base';
import stringToColor from 'helpers/stringToColor';
import { tabs } from 'decorators';
import moment from 'moment-timezone';
import { NO_CAMPAIGN } from './analyticsConst';
import AnalyticsSingleStatBox from './AnalyticsSingleStatBox';
import config from 'config';

@tabs('summary')
class AnalyticsDetails extends BaseComponent {
  static propTypes = {
    sentEmails: PropTypes.object
  }

  componentDidMount() {
    const { params: { id } } = this.props;
    this.fetchSentEmail(id);
  }

  fetchSentEmail(id) {
    const { dispatch } = this.props;
    dispatch(sentEmailLoadThunk(id));
  }

  roundRate(num) {
    return Math.round(num * 10000) / 100;
  }

  render() {
    const { params: { id }, list, sentEmailLoading } = this.props;
    const { tab } = this.state;
    const email = list[id] || {};
    const start = moment(email.sentDate);
    const end = moment(email.sentDate).add(48, 'hours');
    const sentDate = moment.tz(email.sentDate, moment.tz.guess()).format('lll z');
    const isSpinning = !email.name && sentEmailLoading;
    return (
      <div>
        <Spinner text={"Loading analytics..."} isVisible={isSpinning} />
        <Row>
          <Col xs={12} className={!isSpinning ? 'show' : 'hidden'}>
            <div className="help-block" />
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Row>
                  <Col sm={8}>
                    <h4>Analytics for: {email.name}</h4>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="help-block" />
            <Tabs
              activeKey={tab}
              onSelect={(t) => this.handleTabSelect(t)}
              id="analytics-tabs"
            >
              <Tab eventKey="summary" title="Summary">
                {email.emailId &&
                  <Row>
                    <div className="help-block" />
                    <Col xs={12} sm={12} md={4} lg={3}>
                      <div className="stat-box stat-summary">
                        <div className="stat-short-string">
                          <strong>Name</strong>: {email.name}
                        </div>
                        <div className="stat-short-string">
                          <strong>Campaign</strong>: &nbsp;
                          {email.campaign ?
                            <Badge style={{ backgroundColor: stringToColor(email.campaign._id) }}>
                              {email.campaign.name}
                            </Badge> : NO_CAMPAIGN
                          }
                        </div>
                        <div className="stat-short-string">
                          <strong>Sent:</strong>: {sentDate}
                        </div>
                        <div className="stat-short-string">
                          <strong>Subject:</strong>: {email.subject}
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <AnalyticsSingleStatBox
                        value={email.analytics.injection.toLocaleString()}
                        label="Sent"
                        className="stat-sent"
                        url={`${config.urlInfix}/analytics/emails/${id}/injection`}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <AnalyticsSingleStatBox
                        value={email.analytics.delivery.toLocaleString()}
                        label="Delivered"
                        className="stat-delivered"
                        url={`${config.urlInfix}/analytics/emails/${id}/delivery`}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <AnalyticsSingleStatBox
                        value={`${this.roundRate(email.analytics.deliveryRate)}%`}
                        label="Delivery Rate"
                        className="stat-dr"
                      />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <AnalyticsSingleStatBox
                        value={email.analytics.openUnique.toLocaleString()}
                        label="Unique Open"
                        className="stat-unique-open"
                        url={`${config.urlInfix}/analytics/emails/${id}/open`}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <AnalyticsSingleStatBox
                        value={
                          `${this.roundRate(email.analytics.openRate)}%`}
                        label="Open Rate"
                        className="stat-or"
                      />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <AnalyticsSingleStatBox
                        value={email.analytics.linkUnsubscribeUnique.toLocaleString()}
                        label="Unique Unsubscribe"
                        className="stat-unique-unsubscribe"
                        url={`${config.urlInfix}/analytics/emails/${id}/link_unsubscribe`}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <AnalyticsSingleStatBox
                        value={`${this.roundRate(email.analytics.unsubscribeRate)}%`}
                        label="Unsubscribe Rate"
                        className="stat-unsubscribe-rate"
                      />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <AnalyticsSingleStatBox
                        value={email.analytics.clickUnique.toLocaleString()}
                        label="Unique Click"
                        className="stat-unique-click"
                        url={`${config.urlInfix}/analytics/emails/${id}/click`}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <AnalyticsSingleStatBox
                        value={`${this.roundRate(email.analytics.uniqueCTR)}%`}
                        label="Click Through Rate"
                        className="stat-ctr"
                      />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <AnalyticsSingleStatBox
                        value={email.analytics.bounce.toLocaleString()}
                        label="Bounce"
                        className="stat-bounce"
                        url={`${config.urlInfix}/analytics/emails/${id}/bounce`}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <AnalyticsSingleStatBox
                        value={email.analytics.spamComplaint.toLocaleString()}
                        label="Spam Complaint"
                        className="stat-spam-complaint"
                        url={`${config.urlInfix}/analytics/emails/${id}/spam_complaint`}
                      />
                    </Col>
                    <div className="help-block" />
                    <Col xs={12} sm={12} md={6} lg={6}>
                      <AnalyticsTimeLineGraph
                        title="Opened emails per hour"
                        color="rgb(172,146,236)"
                        queryType="count"
                        emailId={id}
                        action="open"
                        start={start.toDate()}
                        end={end.toDate()}
                      />
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                      <AnalyticsTimeLineGraph
                        title="Clicked emails per hour"
                        color="green"
                        queryType="count"
                        emailId={id}
                        action="click"
                        start={start.toDate()}
                        end={end.toDate()}
                      />
                    </Col>
                  </Row>}
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </div>
    );
  }
}

@connect((state) => ({
  sentEmailLoading: state.sentEmails.sentEmailLoading,
  list: state.sentEmails.list,
  error: state.sentEmails.error
}))
export default class AnalyticsDetailsConnected
extends AnalyticsDetails { }
