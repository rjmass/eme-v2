import React from 'react';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import fields from './account.fields';
import { initialize, getValues } from 'redux-form';
import { Row, Col, Button, FormGroup } from 'react-bootstrap';
import { BaseComponent } from 'components/Base';
import { AccountForm, PreferencesForm, FORM_NAME } from 'components/Account';
import { accountUpdateThunk, accountLoadThunk } from 'redux/modules/auth';

export class AccountIndex extends BaseComponent {

  componentDidMount() {
    this.fetchAccount();
  }

  fetchAccount() {
    const { dispatch } = this.props;
    dispatch(accountLoadThunk());
  }

  handleUpdate() {
    const { dispatch, form, user: { _id: id } } = this.props;
    const userDetails = getValues(form.accountForm);
    dispatch(accountUpdateThunk(id, userDetails));
  }

  componentWillReceiveProps(nextProps) {
    const { user: oldUser, dispatch } = this.props;
    const { user: nextUser } = nextProps;

    if (!isEqual(oldUser, nextUser)) {
      dispatch(initialize(FORM_NAME, nextUser, fields));
    }
  }

  render() {
    const { user } = this.props;
    return (
      <Row>
        <Col>
          <Row>
            <Col sm={6}>
              <FormGroup>
                <Col sm={6}>
                  <h3>Account Settings</h3>
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormGroup>
                <Col sm={6}>
                  <Button bsStyle="primary" onClick={() => this.handleUpdate()}>&nbsp;
                    <span className="glyphicon glyphicon-floppy-save" />&nbsp;
                    Save
                  </Button>
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <div className="help-block" />
          <Row>
            <Col xs={6}>
              <AccountForm
                user={user}
                onSubmit={(usr) => this.updateHandler(usr)}
              />
            </Col>
            <Col xs={6}>
              <PreferencesForm
                user={user}
                onSubmit={(usr) => this.updateHandler(usr)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

@connect((state) => ({ user: state.auth.user, form: state.form }))
export default class AccountIndexConnected extends AccountIndex { }
