import React from 'react';
import { BaseList } from 'components/Base';
import { connect } from 'react-redux';
import { createPagingButton } from 'components/PagingButton';
import TemplateItem from './TemplateItem';
import config from 'config';
import { campaignsLoadThunk } from 'redux/modules/campaigns';

const pagingButton = createPagingButton((eventKey) => {
  return `${config.urlInfix}/templates/list/${eventKey}`;
});
const renderItem = (template) => <TemplateItem template={template} key={template._id} />;

@connect()
export default class TemplatesList extends BaseList {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(campaignsLoadThunk());
  }

  get pagingButton() {
    return pagingButton;
  }

  get renderItem() {
    return renderItem;
  }

  get headers() {
    return ['Name', 'Briefing', 'Updated'];
  }
}
