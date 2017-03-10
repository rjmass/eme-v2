import React, { Component, PropTypes } from 'react';

export default class SubstitutionStringFormatter extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
      PropTypes.bool
    ]).isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value;
  }

  render() {
    return <div title={this.props.value}>{this.props.value.toString()}</div>;
  }
}
