import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import config from 'config';

export default class AnalyticsLinkFormatter extends Component {
  static propTypes = {
    email: PropTypes.object.isRequired
  }

  render() {
    const { email } = this.props;
    return (
      <Link
        to={`${config.urlInfix}/analytics/emails/${email.emailId}`}
      >
        {` ${email.name} `}
      </Link>
    );
  }
}
