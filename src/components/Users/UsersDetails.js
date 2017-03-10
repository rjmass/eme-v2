import React, { PropTypes } from 'react';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';
import { push } from 'react-router-redux';
import config from 'config';
import validator from 'components/Validator/validator';
import {
  userLoadThunk, userUpdateThunk,
  userValidationError, userDeleteThunk
} from 'redux/modules/users';
import { Row, Col } from 'react-bootstrap';
import UserForm from './UserForm';
import schema from './user-update.schema';
import fields from './user.fields';
import { Spinner } from 'components/Spinner';
import { Message } from 'components/Message';
import UsersBase from './UsersBase';

const FORM_NAME = 'userForm';

export class UserDetails extends UsersBase {
  static propTypes = {
    list: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    substitutions: PropTypes.object.isRequired
  }

  static get contextTypes() {
    return { router: React.PropTypes.object };
  }

  componentDidMount() {
    const { params: { id } } = this.props;
    this.fetchUser(id);
  }

  componentWillReceiveProps(nextProps) {
    const { params: { id: oldId }, dispatch, list: oldList } = this.props;
    const { params: { id: nextId }, list: nextList } = nextProps;

    const currentUser = oldList[oldId];
    const nextUser = nextList[nextId];

    if (!isEqual(currentUser, nextUser)) {
      dispatch(initialize(FORM_NAME, nextUser, fields));
    }
  }

  fetchUser(id) {
    const { dispatch } = this.props;
    dispatch(userLoadThunk(id));
  }

  async handleDelete() {
    const { params: { id }, dispatch } = this.props;
    this.closeDialog('delete');
    await dispatch(userDeleteThunk(id));
    await dispatch(push(`${config.urlInfix}/users`));
  }

  isUserDirty() {
    const { form: { userForm } } = this.props;
    return this.isFormDirty(userForm);
  }

  async handleFormSave(user) {
    const { dispatch } = this.props;
    const valid = validator.validate(user, schema);
    if (valid) {
      const { params: { id } } = this.props;
      await dispatch(userUpdateThunk(id, user));
      return this.props.dispatch(initialize(FORM_NAME, user, fields));
    }
    return dispatch(userValidationError(validator.error));
  }

  render() {
    const { error, substitutions, params: { id }, userLoading } = this.props;
    const user = this.props.list[id] || {};
    const isSpinning = !user._id && userLoading;

    return (
      <Row>
        <Spinner text={"Loading User..."} isVisible={isSpinning} />
        <Col className={isSpinning ? 'hidden' : 'show'} xs={12}>
          <div className="help-block" />
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              <div className="help-block" />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              {error ? <Message text={error.message} type="danger" /> : null}
              <UserForm
                user={user}
                activeTab={this.state.tab}
                onTabSelect={(key) => this.handleTabSelect(key)}
                onSubmit={(userData) => this.handleFormSave(userData)}
                substitutionEnabled={substitutions.enabled}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

@connect((state) => ({
  list: state.users.list,
  error: state.users.error,
  form: state.form,
  substitutions: state.substitutions,
  userLoading: state.users.userLoading
}))
export default class UserDetailsConnected extends UserDetails { }
