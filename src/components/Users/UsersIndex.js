import React, { Component, PropTypes } from 'react';
import UsersList from './UsersList';
import { Link } from 'react-router';
import {
  usersLoadThunk,
  getUsers,
  usersFilter,
  usersSort
} from 'redux/modules/users';
import { connect } from 'react-redux';
import { Button, Row, Col } from 'react-bootstrap';
import { Spinner } from 'components/Spinner';
import { createSelector } from 'reselect';
import config from 'config';
import listSorter from 'helpers/listSorter';

const PER_PAGE = 20;

export class UsersIndex extends Component {

  static propTypes = {
    users: PropTypes.shape({
      list: PropTypes.array.isRequired
    }).isRequired
  }

  componentDidMount() {
    this.fetchUsers();
  }

  componentWillReceiveProps(nextProps) {
    const { page = 1 } = this.props.params;
    const { page: newPage = 1 } = nextProps.params;
    if (page !== newPage) {
      this.fetchUsers();
    }
  }

  getUsersPage() {
    const { users, params: { page = 1 } } = this.props;
    return users.list.slice(PER_PAGE * (page - 1), PER_PAGE * page);
  }

  fetchUsers() {
    const { dispatch } = this.props;
    dispatch(usersLoadThunk());
  }

  handleFilter(filter) {
    const { dispatch } = this.props;
    dispatch(usersFilter(filter));
  }

  handleSort(key) {
    const { dispatch } = this.props;
    dispatch(usersSort({ sortFunc: listSorter, key }));
  }

  render() {
    const { users } = this.props;
    const page = Number(this.props.params.page) ? Number(this.props.params.page) : 1;
    const totalCount = users.list.length;
    const isSpinning = !totalCount && users.listLoading;
    return (
      <div>
        <Spinner text={"Loading users..."} isVisible={isSpinning} />
        <div className="help-block"></div>
        <Row>
          <Col xs={12} className={!isSpinning ? 'show' : 'hidden'}>
            <Link to={`${config.urlInfix}/users/new`}>
              <Button bsStyle="success" bsSize="small">
                <i className="fa fa-plus" /> New
              </Button>
            </Link>
            <UsersList
              list={this.getUsersPage()}
              totalCount={totalCount}
              sort={users.sort}
              filter={users.filter}
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

const users = state => state.users;
const list = createSelector(users, getUsers);

@connect((state) => ({ users: { ...state.users, list: list(state) } }))
export default class UsersIndexConnected extends UsersIndex { }
