import React, { Component, PropTypes } from 'react';

export default class AnalyticsActionUrlItem extends Component {

  static propTypes = {
    link: PropTypes.object.isRequired
  }

  render() {
    const { link } = this.props;

    return (
      <tr>
        <td><a target="_blank" href={link.url}>{link.url}</a></td>
        <td>{link.click}</td>
        <td>{link.clickUnique}</td>
      </tr>
    );
  }
}
