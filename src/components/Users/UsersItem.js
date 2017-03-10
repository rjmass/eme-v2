import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import config from 'config';

export default class UsersItem extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  }

  render() {
    const { user } = this.props;
    return (
      <tr>
        <td className="col-xs-6">
          <i className="fa fa-user-o" /> &nbsp;
          <Link to={`${config.urlInfix}/users/${user._id}`}>{` ${user.username}`}</Link>
        </td>
        <td className="col-xs-2">
          {user.name || ''}
        </td>
        <td className="col-xs-2">
          {user.admin ? <i className="fa fa-check" /> : null}
        </td>
        <td className="col-xs-2">
          {user.active ? <i className="fa fa-check" /> : null}
        </td>
      </tr>
    );
  }
}
