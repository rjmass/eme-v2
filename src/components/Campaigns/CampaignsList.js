import React from 'react';
import { BaseList } from 'components/Base';
import { createPagingButton } from 'components/PagingButton';
import CampaignItem from './CampaignItem';
import config from 'config';

const pagingButton = createPagingButton(eventKey => {
  return `${config.urlInfix}/campaigns/list/${eventKey}`;
});
const renderItem = (campaign) =>
  <CampaignItem campaign={campaign} key={campaign._id} />;

export default class CampaignsList extends BaseList {

  get pagingButton() {
    return pagingButton;
  }

  get renderItem() {
    return renderItem;
  }

  get headers() {
    return ['Name', 'Active', 'Updated'];
  }
}
