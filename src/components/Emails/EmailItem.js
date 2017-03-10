import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Badge } from 'react-bootstrap';
import stringToColor from 'helpers/stringToColor';
import config from 'config';
import moment from 'moment';

export default class EmailItem extends Component {
  static propTypes = {
    email: PropTypes.object.isRequired
  }


  render() {
    const { email, handleChange, checked } = this.props;
    const { campaignDetails = {} } = email;
    const atMoment = moment(new Date(email.updatedAt)).format('Do MMM YYYY h:mma');
    const truncateHeader = (text = '', maxLength) => {
      if (text.length > maxLength) {
        return `${text.substr(0, maxLength)}`;
      }
      return text;
    };

    return (
      <tr>
        <td className="col-xs-1 col-sm-1 col-md-1 col-lg-1">
          <input type="checkbox" checked={checked} onChange={() => handleChange(email._id)} />
        </td>
        <td className="col-xs-4 col-sm-4 col-md-4 col-lg-4 truncate">
          <i className="fa fa-envelope-o" /> &nbsp;
          <Link to={`${config.urlInfix}/emails/${email._id}`}>
            {truncateHeader(`${email.name}`, 40)}...
          </Link>
        </td>
        <td className="col-xs-3 col-sm-3 col-md-3 col-lg-3 truncate">
          <span>{truncateHeader(email.subject, 35)}...</span>
        </td>
        <td className="col-xs-2 col-sm-2 col-md-2 col-lg-2 truncate">
          <Badge
            style={{ backgroundColor: stringToColor(campaignDetails._id) }}
          >
            {campaignDetails.name}
          </Badge>
        </td>
        <td className="col-xs-2 col-sm-2 col-md-2 col-lg-2 truncate">
          <span>{atMoment}</span>
        </td>
      </tr>
    );
  }
}
