import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Badge } from 'react-bootstrap';
import config from 'config';
import moment from 'moment';
import stringToColor from 'helpers/stringToColor';

export default class TemplateItem extends Component {
  static propTypes = {
    template: PropTypes.object.isRequired
  }

  render() {
    const { template } = this.props;
    const { campaignDetails = {} } = template;
    const atMoment = template.updatedAt ?
      moment(new Date(`${template.updatedAt}`)).format('Do MMM YYYY h:mma') : '';
    return (
      <tr>
        <td className="col-xs-8 col-sm-8 col-md-8 col-lg-8 truncate">
          <i className="fa fa-file-text-o" /> &nbsp;
          <Link to={`${config.urlInfix}/templates/${template._id}`}>{` ${template.name}`}</Link>
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
