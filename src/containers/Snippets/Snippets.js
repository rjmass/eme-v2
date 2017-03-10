import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

@connect(state => ({ user: state.auth.user }))
export default class Snippets extends Component {

  static propTypes = {
    user: PropTypes.object
  };

  render() {
    const { children } = this.props;
    return (
      <div className="container">
        <Helmet title="Emails" />
        {children}
      </div>
    );
  }
}
