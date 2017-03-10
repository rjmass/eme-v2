import React from 'react';
import { BaseList } from 'components/Base';
import { createPagingButton } from 'components/PagingButton';
import SubstitutionItem from './SubstitutionItem';
import config from 'config';

const pagingButton = createPagingButton(eventKey => {
  return `${config.urlInfix}/substitutions/list/${eventKey}`;
});
const renderItem = (substitution) =>
  <SubstitutionItem substitution={substitution} key={substitution._id} />;

export default class SubstitutionsList extends BaseList {

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
