import React from 'react';
import { BaseList } from 'components/Base';
import EmailHistoryItem from './EmailHistoryItem';

const renderItem = (email) => <EmailHistoryItem email={email} key={email.emailId} />;

export default class EmailHistoryList extends BaseList {

  get renderItem() {
    return renderItem;
  }

  get filters() {
    return [];
  }

}
