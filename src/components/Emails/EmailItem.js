import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Badge } from 'react-bootstrap';
import stringToColor from 'helpers/stringToColor';
import truncateHeader from 'helpers/truncateText';
import config from 'config';
import moment from 'moment';

export default class EmailItem extends Component {
  static propTypes = {
    email: PropTypes.object.isRequired
  }

  render() {
    const { email } = this.props;
    const { campaignDetails = {} } = email;
    const atMoment = moment(new Date(email.updatedAt)).format('Do MMM YYYY h:mma');

    return (
      <tr>
        <td className="col-xs-5 col-sm-5 col-md-5 col-lg-5 truncate">
          <i className="fa fa-envelope-o" /> &nbsp;
          <Link to={`${config.urlInfix}/emails/${email._id}`}>
            {email.name}
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
