import React from 'react';
import { BaseList } from 'components/Base';
import { createPagingButton } from 'components/PagingButton';
import UserItem from './UsersItem';
import config from 'config';

const pagingButton = createPagingButton((eventKey) => {
  return `${config.urlInfix}/users/list/${eventKey}`;
});
const renderItem = (user) => <UserItem user={user} key={user._id} />;

export default class UsersList extends BaseList {

  get pagingButton() {
    return pagingButton;
  }

  get renderItem() {
    return renderItem;
  }

  get headers() {
    return ['Userame', 'Name', 'Admin', 'Active'];
  }
}
