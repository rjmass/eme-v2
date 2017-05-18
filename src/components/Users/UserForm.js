import React, { Component } from 'react';
import { reduxForm, change as changeField } from 'redux-form';
import {
  Form, FormGroup, Row, Col,
  FormControl, Button,
  ControlLabel
} from 'react-bootstrap';
import { collapser } from 'decorators';
import Switch from 'react-bootstrap-switch';
import fields from './user.fields';

const FORM_NAME = 'userForm';

@reduxForm({ form: FORM_NAME, fields })
@collapser()
export default class UserForm extends Component {

  componentDidMount() {
    const { initializeForm, user } = this.props;
    initializeForm(user);
  }

  isAdminUpdateHandler(val) {
    const { dispatch } = this.props;
    dispatch(changeField(FORM_NAME, 'admin', val));
  }

  isActiveUpdateHandler(val) {
    const { dispatch } = this.props;
    dispatch(changeField(FORM_NAME, 'active', val));
  }

  render() {
    const { fields: { username, name, admin, active }, handleSubmit } = this.props;
    return (
      <Row>
        <Col sm={6}>
          <Form horizontal onSubmit={handleSubmit}>
            <div className="form-collapsible form-pale">

              <FormGroup>
                <Col xs={12}>
                  <ControlLabel>Name</ControlLabel>
                  <FormControl type="text" placeholder="Name" {...name} />
                </Col>
                <Col xs={12}>
                  <ControlLabel>Username (email address)</ControlLabel>
                  <FormControl type="text" placeholder="Some.User@ft.com" {...username} />
                </Col>
              </FormGroup>

              <FormGroup>
                <Col xs={6}>
                  <ControlLabel>Admin</ControlLabel>
                  <div>
                    <Switch
                      value={admin.value}
                      onChange={(_, v) => this.isAdminUpdateHandler(v)}
                    />
                  </div>
                </Col>
                <Col xs={6}>
                  <ControlLabel>Active</ControlLabel>
                  <div>
                    <Switch
                      state={active.value}
                      onChange={(v) => this.isActiveUpdateHandler(v)}
                    />
                  </div>
                </Col>
              </FormGroup>

            </div>

            <FormGroup>
              <div className="help-block" />
              <Col sm={8}>
                <Button type="submit" bsStyle="primary">&nbsp;
                  <span className="glyphicon glyphicon-floppy-save" />&nbsp;
                    Save
                </Button>
              </Col>
            </FormGroup>

          </Form>
        </Col>
      </Row>

    );
  }

}
