import React, { Component, PropTypes } from 'react';
import moment from 'moment';

export default class AnalyticsPercentFormatter extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    sortValue: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value;
  }

  render() {
    const date = moment(this.props.value).format('lll');
    return <span>{date}</span>;
  }
}
