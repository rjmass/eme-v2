import React, { Component, PropTypes } from 'react';

export default class AnalyticsPercentFormatter extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired
  }

  shouldComponentUpdate(nextProps) {
    const { value: nextValue } = nextProps;
    const { value } = this.props;
    return nextValue !== value;
  }

  render() {
    const percentComplete = `${this.props.value}%`;
    return <span>{percentComplete}</span>;
  }
}
