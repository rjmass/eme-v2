import React, { Component, PropTypes } from 'react';
import { Table } from 'react-bootstrap';

class AnalyticsActionUrlList extends Component {
  static propTypes = {
    email: PropTypes.object
  }

  render() {
    const { email = {} } = this.props;

    return (
      <div>
        {email.analytics &&
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>URL</th>
                <th>Clicks</th>
                <th>Unique Clicks</th>
              </tr>
            </thead>
            <tbody>
              {email.analytics.links.map((link, key) =>
                <tr key={key}>
                  <td><a target="_blank" href={link.url}>{link.url}</a></td>
                  <td>{link.click}</td>
                  <td>{link.clickUnique}</td>
                </tr>
                )}
            </tbody>
          </Table>
        }
      </div>
    );
  }
}

export default class AnalyticsActionUrlListConnected extends AnalyticsActionUrlList { }
