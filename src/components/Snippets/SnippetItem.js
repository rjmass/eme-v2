import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import config from 'config';
import moment from 'moment';

export default class SnippetItem extends Component {
  static propTypes = {
    snippet: PropTypes.object.isRequired
  }

  render() {
    const { snippet } = this.props;
    const atMoment = snippet.updatedAt ?
      moment(new Date(`${snippet.updatedAt}`)).format('Do MMM YYYY h:mma') : '';
    return (
      <tr>
        <td className="col-xs-10">
          <i className="fa fa-file-code-o" /> &nbsp;
          <Link to={`${config.urlInfix}/snippets/${snippet._id}`}>{` ${snippet.name}`}</Link>
        </td>
        <td className="col-xs-2">
          <span>{atMoment}</span>
        </td>
      </tr>
    );
  }
}
