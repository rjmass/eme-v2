import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import config from 'config';
import moment from 'moment';

export default class SubstitutionItem extends Component {
  static propTypes = {
    substitution: PropTypes.object.isRequired
  }

  render() {
    const { substitution } = this.props;
    const atMoment = moment(new Date(`${substitution.updatedAt}`)).format('Do MMM YYYY h:mma');
    return (
      <tr>
        <td className="col-xs-10">
          <i className="fa fa-users" /> &nbsp;
          <Link
            to={`${config.urlInfix}/substitutions/${substitution._id}`}
          >{substitution.name}</Link>
        </td>
        <td className="col-xs-2">
          <span>{atMoment}</span>
        </td>
      </tr>
    );
  }
}
