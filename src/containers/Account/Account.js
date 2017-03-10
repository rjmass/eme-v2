import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';

export default class Account extends Component {
  static propTypes = {
    user: PropTypes.object
  };

  render() {
    const { children } = this.props;
    return (
      <div className="container">
        <Helmet title="Account" />
        {children}
      </div>
    );
  }
}
