import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import config from 'config';
import moment from 'moment';

export default class CampaignItem extends Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired
  }

  render() {
    const { campaign } = this.props;
    const atMoment = moment(new Date(`${campaign.updatedAt}`)).format('Do MMM YYYY h:mma');
    return (
      <tr>

        <td className="col-xs-9">
          <i className="glyphicon glyphicon-bullhorn" /> &nbsp;
          <Link
            to={`${config.urlInfix}/campaigns/${campaign._id}`}
          >{campaign.name}</Link>
        </td>

        <td className="col-xs-1">
          {!campaign.archived ? <i className="fa fa-check" /> : null}
        </td>

        <td className="col-xs-2">
          <span>{atMoment}</span>
        </td>

      </tr>
    );
  }
}
