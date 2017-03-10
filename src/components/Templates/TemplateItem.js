import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import config from 'config';
import moment from 'moment';

export default class TemplateItem extends Component {
  static propTypes = {
    template: PropTypes.object.isRequired
  }

  render() {
    const { template } = this.props;
    const atMoment = template.updatedAt ?
      moment(new Date(`${template.updatedAt}`)).format('Do MMM YYYY h:mma') : '';
    return (
      <tr>
        <td className="col-xs-10">
          <i className="fa fa-file-text-o" /> &nbsp;
          <Link to={`${config.urlInfix}/templates/${template._id}`}>{` ${template.name}`}</Link>
        </td>
        <td className="col-xs-2">
          <span>{atMoment}</span>
        </td>
      </tr>
    );
  }
}
