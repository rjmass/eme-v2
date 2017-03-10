import React from 'react';
import { BaseList } from 'components/Base';
import { createPagingButton } from 'components/PagingButton';
import AnalyticsActionRecipientItem from './AnalyticsActionRecipientItem';
import config from 'config';

export default class AnalyticsActionRecipientList extends BaseList {

  get pagingButton() {
    const { action, id } = this.props;
    return createPagingButton((eventKey) => {
      return `${config.urlInfix}/analytics/emails/${id}/${action}/list/${eventKey}`;
    });
  }

  get renderItem() {
    return (email) => <AnalyticsActionRecipientItem emailAddress={email} key={email} />;
  }
}
