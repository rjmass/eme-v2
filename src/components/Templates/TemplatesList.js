import React from 'react';
import { BaseList } from 'components/Base';
import { createPagingButton } from 'components/PagingButton';
import TemplateItem from './TemplateItem';
import config from 'config';

const pagingButton = createPagingButton((eventKey) => {
  return `${config.urlInfix}/templates/list/${eventKey}`;
});
const renderItem = (template) => <TemplateItem template={template} key={template._id} />;

export default class TemplatesList extends BaseList {

  get pagingButton() {
    return pagingButton;
  }

  get renderItem() {
    return renderItem;
  }

  get headers() {
    return ['Name', 'Updated'];
  }
}
