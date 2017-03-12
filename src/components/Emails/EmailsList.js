import React from 'react';
import { BaseList } from 'components/Base';
import { createPagingButton } from 'components/PagingButton';
import { CampaignPicker } from 'components/Campaigns';
import EmailItem from './EmailItem';
import config from 'config';

const pagingButton = createPagingButton(eventKey => `${config.urlInfix}/emails/list/${eventKey}`);

export default class EmailsList extends BaseList {
  handleCampaignFilter(campaignId) {
    const { onFilter } = this.props;
    onFilter({ campaignId });
  }

  get campaignFilter() {
    const { filter: { campaignId } } = this.props;
    return (
      <CampaignPicker
        value={campaignId}
        editable={false}
        onSelect={(cId) => this.handleCampaignFilter(cId)}
      />
    );
  }

  get filters() {
    return [this.campaignFilter, ...super.filters];
  }

  get pagingButton() {
    return pagingButton;
  }

  get renderItem() {
    const renderItem = (email) => {
      return (
        <EmailItem
          email={email}
          key={email._id}
        />
      );
    };
    return renderItem;
  }

  get headers() {
    return ['Name', 'Subject', 'Briefing', 'Updated'];
  }
}
