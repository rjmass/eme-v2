import React from 'react';
import config from 'config';
import UserForm from './UserForm';
import schema from './user.schema';
import UsersBase from './UsersBase';
import { Message } from '../Message';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Row, Col } from 'react-bootstrap';
import validator from 'components/Validator/validator';
import { userCreateThunk, userValidationError } from 'redux/modules/users';

@connect((state) => ({
  error: state.users.error,
  form: state.form,
  substitutions: state.substitutions
}))
export default class UserCreate extends UsersBase {

  async submitHandler(user) {
    const { dispatch } = this.props;
    const valid = validator.validate(user, schema);

    if (!valid) {
      return dispatch(userValidationError(validator.error));
    }

    const newUser = await dispatch(userCreateThunk(user));
    return dispatch(push(`${config.urlInfix}/users/${newUser._id}`));
  }

  get emptyUser() {
    return {
      name: '',
      username: '',
      admin: false,
      active: true
    };
  }

  render() {
    const user = this.emptyUser;
    const { error } = this.props;

    return (
      <Row>
        <Col xs={12}>
          <div className="help-block" />
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              <h4>Create user</h4>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              {error ? <Message type="danger" text={error.message} /> : null}
              <UserForm
                user={user}
                activeTab={this.state.tab}
                onTabSelect={(key) => this.handleTabSelect(key)}
                onSubmit={(subUser) => this.submitHandler(subUser)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

}
