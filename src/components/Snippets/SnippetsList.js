import React from 'react';
import { BaseList } from 'components/Base';
import { createPagingButton } from 'components/PagingButton';
import SnippetItem from './SnippetItem';
import config from 'config';

const pagingButton = createPagingButton((eventKey) => {
  return `${config.urlInfix}/snippets/list/${eventKey}`;
});
const renderItem = (snippet) => <SnippetItem snippet={snippet} key={snippet._id} />;

export default class SnippetsList extends BaseList {

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
