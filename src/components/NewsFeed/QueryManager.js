import React, { Component } from 'react';
import { connect } from 'react-redux';
import QueryList from './QueryList';
import QueryForm from './QueryForm';
import { getQueries, queryCreateThunk, queriesLoadThunk,
  queriesFilter, queryDeleteThunk } from 'redux/modules/queries';
import { pager } from 'decorators';

@pager(4)
class QueryManager extends Component {

  componentWillMount() {
    this.props.dispatch(queriesLoadThunk());
  }

  handleFormSubmission(query) {
    this.props.dispatch(queryCreateThunk(query));
  }

  handleFilter(filter) {
    this.props.dispatch(queriesFilter(filter));
  }

  handleItemDelete(id) {
    this.props.dispatch(queryDeleteThunk(id));
  }

  render() {
    const { queries, list, onItemClick, query } = this.props;
    const { page, pageSize } = this.state;
    const totalCount = list.length;
    return (
      <div className="query-manager">
        <QueryList
          list={this.getCurrentPageList()}
          filter={queries.filter}
          onFilter={(filter) => this.handleFilter(filter)}
          totalCount={totalCount}
          perPage={pageSize}
          page={page}
          listClassName="query-manager-list"
          onItemClick={onItemClick}
          onItemDelete={(id) => this.handleItemDelete(id)}
          onPageChange={(p) => this.handlePageChange(p)}
        />
        <QueryForm
          query={query}
          onSubmit={(qry) => this.handleFormSubmission(qry)}
        />
      </div>
    );
  }
}

@connect((state) => ({ queries: state.queries, list: getQueries(state.queries) }))
export default class QueryManagerConnected extends QueryManager { }
