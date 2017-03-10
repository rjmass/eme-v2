import React, { Component, PropTypes } from 'react';
import moment from 'moment';

export default class AnalyticsDateRangeFormatter extends Component {
  static propTypes = {
    value: PropTypes.shape({
      startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    }).isRequired,
    inputFormat: PropTypes.string,
    displayFormat: PropTypes.string
  }

  static defaultProps = {
    inputFormat: 'YYYY-MM-DD',
    displayFormat: 'YYYY-MM-DD',
    value: { startDate: null, endDate: null }
  }

  formatDate(date) {
    if (moment.isMoment(date)) {
      return moment(date).format(this.props.displayFormat);
    }
    return moment(date, this.props.inputFormat)
      .format(this.props.displayFormat);
  }

  render() {
    const startDate = this.props.value.startDate;
    const endDate = this.props.value.endDate;
    return (
      <div>
        <div>
          <strong>From</strong>: {startDate}
        </div>
        <div>
          <strong>To</strong>: {endDate}
        </div>
      </div>
    );
  }
}
