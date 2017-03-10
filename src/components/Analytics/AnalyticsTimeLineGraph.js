import { PropTypes } from 'react';
import KeenBase from './KeenBase';

export default class AnalyticsTimeLineGraph extends KeenBase {

  static propTypes: {
    queryType: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    emailId: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    start: PropTypes.object.isRequired
  }

  get queryParams() {
    const { emailId, action, start, end = new Date() } = this.props;

    const query = Object.assign({}, this.baseQuery, {
      filters: [
        { operator: 'eq', property_name: 'context.product', property_value: 'MeMe' },
        { operator: 'eq', property_name: 'context.emailId', property_value: emailId },
        { operator: 'eq', property_name: 'action', property_value: action }
      ],
      timeframe: {
        start,
        end
      }
    });

    return query;
  }
}
