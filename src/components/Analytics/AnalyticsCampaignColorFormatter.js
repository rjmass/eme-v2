import React, { Component, PropTypes } from 'react';
import { Badge } from 'react-bootstrap';
import stringToColor from 'helpers/stringToColor';

export default class AnalyticsCampaignColorFormatter extends Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    const { campaign: nextCampaign } = nextProps;
    const { _id: nextId } = nextCampaign;
    const { campaign } = this.props;
    const { _id: id } = campaign;
    return nextId !== id;
  }

  render() {
    const { campaign } = this.props;
    const { _id: id } = campaign;
    return (
      (campaign && id) ?
        <Badge style={{ backgroundColor: stringToColor(id) }}>
            {campaign.name}
        </Badge> : null
    );
  }
}
