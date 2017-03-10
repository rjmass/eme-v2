import React, { Component, PropTypes } from 'react';

export default class AnalyticsActionRecipientItem extends Component {

  static propTypes = {
    emailAddress: PropTypes.string.isRequired
  }

  render() {
    const { emailAddress } = this.props;
    return (
      <tr>
        <td>{emailAddress}</td>
      </tr>
    );
  }
}
