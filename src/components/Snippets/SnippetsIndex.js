import React, { Component, PropTypes } from 'react';
import SnippetsList from './SnippetsList';
import { Link } from 'react-router';
import {
  snippetsLoadThunk,
  getSnippets,
  snippetsFilter,
  snippetsSort } from 'redux/modules/snippets';
import { connect } from 'react-redux';
import { Button, Row, Col } from 'react-bootstrap';
import { Spinner } from 'components/Spinner';
import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import listSorter from 'helpers/listSorter';
import config from 'config';

const PER_PAGE = 20;

export class SnippetsIndex extends Component {

  static propTypes = {
    snippets: PropTypes.shape({
      list: PropTypes.array.isRequired
    }).isRequired
  }

  componentDidMount() {
    this.fetchSnippets();
  }

  componentWillReceiveProps(nextProps) {
    const { page = 1 } = this.props.params;
    const { page: newPage = 1 } = nextProps.params;
    if (page !== newPage) {
      this.fetchSnippets();
    }
  }

  getSnippetsPage() {
    const { snippets, params: { page = 1 } } = this.props;
    return snippets.list.slice(PER_PAGE * (page - 1), PER_PAGE * page);
  }

  fetchSnippets() {
    const { dispatch } = this.props;
    dispatch(snippetsLoadThunk());
  }

  handleFilter(filter) {
    const { dispatch } = this.props;
    dispatch(push(`${config.urlInfix}/snippets`));
    dispatch(snippetsFilter(filter));
  }

  handleSort(key) {
    const { dispatch } = this.props;
    dispatch(snippetsSort({ sortFunc: listSorter, key }));
  }

  render() {
    const { snippets } = this.props;
    const page = Number(this.props.params.page) ? Number(this.props.params.page) : 1;
    const totalCount = snippets.list.length;
    const isSpinning = !totalCount && snippets.listLoading;
    return (
      <div>
        <Spinner text={"Loading snippets..."} isVisible={isSpinning} />
        <div className="help-block"></div>
        <Row>
          <Col xs={12} className={!isSpinning ? 'show' : 'hidden'}>
            <Link to={`${config.urlInfix}/snippets/new`}>
              <Button bsStyle="success" bsSize="small"><i className="fa fa-plus" /> New</Button>
            </Link>
            <SnippetsList
              list={this.getSnippetsPage()}
              sort={snippets.sort}
              totalCount={totalCount}
              filter={snippets.filter}
              onFilter={(filter) => this.handleFilter(filter)}
              onSort={(key) => this.handleSort(key)}
              page={page}
              perPage={PER_PAGE}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const snippets = state => state.snippets;
const list = createSelector(snippets, getSnippets);

@connect((state) => ({ snippets: { ...state.snippets, list: list(state) } }))
export default class SnippetsIndexConnected extends SnippetsIndex { }
