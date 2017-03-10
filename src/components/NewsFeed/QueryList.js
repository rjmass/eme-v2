import React from 'react';
import { BaseList } from 'components/Base';
import QueryItem from './QueryItem';

export default class QueryList extends BaseList {

  get renderItem() {
    const { onItemDelete, onItemClick } = this.props;
    return (query) => (
      <QueryItem
        query={query}
        key={query._id}
        onClick={() => onItemClick(query)}
        onDelete={() => onItemDelete(query._id)}
      />
    );
  }

  render() {
    return (
      <div className="query-list-dialog">
        {super.render()}
      </div>
    );
  }
}
