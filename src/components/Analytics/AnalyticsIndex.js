import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { Spinner } from 'components/Spinner';
import { sentEmailsLoadThunk, getSentEmails } from 'redux/modules/sentEmails';
import AnalyticsList from './AnalyticsList';
import AnalyticsDateFormatter from './AnalyticsDateFormatter';
import AnalyticsLinkFormatter from './AnalyticsLinkFormatter';
import AnalyticsCampaignColorFormatter from './AnalyticsCampaignColorFormatter';
import AnalyticsPercentFormatter from './AnalyticsPercentFormatter';
import 'react-data-grid/themes/react-data-grid.css';

const roundRate = num => {
  return Math.round(num * 10000) / 100;
};

const listSelector = (_, props) => props.sentEmails.list;
const rowSelector = createSelector(
  [listSelector], list => {
    return list.map(email => {
      return {
        Name: <AnalyticsLinkFormatter email={email} />,
        'Sent Date': <AnalyticsDateFormatter
          sortValue={moment(email.sentDate)}
          value={email.sentDate}
        />,
        Campaign: email.campaign ?
          <AnalyticsCampaignColorFormatter campaign={email.campaign} /> : '',
        Sent: email.analytics.injection || 0,
        Delivered: email.analytics.delivery || 0,
        DR: <AnalyticsPercentFormatter value={roundRate(email.analytics.deliveryRate) || 0} />,
        Open: email.analytics.open || 0,
        'Unique Open': email.analytics.openUnique || 0,
        OR: <AnalyticsPercentFormatter value={roundRate(email.analytics.openRate) || 0} />,
        Click: email.analytics.click || 0,
        'Unique Click': email.analytics.clickUnique || 0,
        CTR: <AnalyticsPercentFormatter value={roundRate(email.analytics.uniqueCTR) || 0} />,
        Bounce: email.analytics.bounce || 0,
        Spam: email.analytics.spamComplaint || 0,
        'Unique Unsubscribe': email.analytics.linkUnsubscribeUnique || 0,
        UR: <AnalyticsPercentFormatter
          value={roundRate(email.analytics.unsubscribeRate) || 0}
        />
      };
    });
  });

export class AnalyticsIndex extends Component {
  static propTypes = {
    sentEmails: PropTypes.shape({
      list: PropTypes.array.isRequired
    }).isRequired
  }

  componentDidMount() {
    this.fetchSentEmails();
  }

  fetchSentEmails() {
    const { dispatch } = this.props;
    dispatch(sentEmailsLoadThunk());
  }

  render() {
    const { sentEmails } = this.props;
    const isSpinning = !sentEmails.list.length && sentEmails.listLoading;
    return (
      <div>
        <Spinner text={"Loading analytics..."} isVisible={isSpinning} />
        <div className="help-block"></div>
        <Row>
          <Col xs={12} className={!isSpinning ? 'show' : 'hidden'}>
            <AnalyticsList
              rows={rowSelector(null, this.props)}
              listLoading={sentEmails.listLoading}
              filter={sentEmails.filter}
              onFilter={(filter) => this.handleFilter(filter)}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

@connect(state => ({ sentEmails: { ...state.sentEmails, list: getSentEmails(state.sentEmails) } }))
export default class AnalyticsIndexConnected extends AnalyticsIndex { }
