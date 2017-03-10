import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { substitutionsLoadThunk,
  getSubstitutions,
  substitutionsFilter,
  substitutionsSort } from 'redux/modules/substitutions';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { Spinner } from 'components/Spinner';
import SubstitutionsList from './SubstitutionsList';
import { createSelector } from 'reselect';
import config from 'config';
import listSorter from 'helpers/listSorter';

const PER_PAGE = 20;

export class SubstitutionsIndex extends Component {
  static propTypes = {
    substitutions: PropTypes.shape({
      list: PropTypes.array.isRequired
    }).isRequired
  }

  componentDidMount() {
    this.fetchSubstitutions();
  }

  componentWillReceiveProps(nextProps) {
    const { params: { page = 1 } } = this.props;
    const { params: { page: newPage = 1 } } = nextProps;
    if (page !== newPage) {
      this.fetchSubstitutions();
    }
  }

  getSubstitutionsPage() {
    const { substitutions, params: { page = 1 } } = this.props;
    return substitutions.list.slice(PER_PAGE * (page - 1), PER_PAGE * page);
  }

  fetchSubstitutions() {
    const { dispatch } = this.props;
    dispatch(substitutionsLoadThunk());
  }

  handleFilter(filter) {
    const { dispatch } = this.props;
    dispatch(substitutionsFilter(filter));
  }

  handleSort(key) {
    const { dispatch } = this.props;
    dispatch(substitutionsSort({ sortFunc: listSorter, key }));
  }

  render() {
    const { substitutions } = this.props;
    const page = Number(this.props.params.page) ? Number(this.props.params.page) : 1;
    const totalCount = substitutions.list.length;
    const isSpinning = !totalCount && substitutions.substitutionsLoading;
    return (
      <div>
        <Spinner text={"Loading lists..."} isVisible={isSpinning} />
        <div className="help-block"></div>
        <Row>
          <Col xs={12} className={!isSpinning ? 'show' : 'hidden'}>
            <Link to={`${config.urlInfix}/substitutions/new`}>
              <Button bsStyle="success" bsSize="small"><i className="fa fa-plus" /> New</Button>
            </Link>
            <SubstitutionsList
              list={this.getSubstitutionsPage()}
              sort={substitutions.sort}
              totalCount={totalCount}
              filter={substitutions.filter}
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

const substitutions = state => state.substitutions;
const list = createSelector(substitutions, getSubstitutions);

@connect(state => ({ substitutions: { ...state.substitutions, list: list(state) } }))
export default class SubstitutionsIndexConnected extends SubstitutionsIndex { }
