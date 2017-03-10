import React, { Component } from 'react';
import { Link } from 'react-router';

export default (buildTo) => class PagingButton extends Component {
  render() {
    const { eventKey, children } = this.props;
    const to = buildTo(eventKey);
    return (<Link to={to}>{children}</Link>);
  }
};
