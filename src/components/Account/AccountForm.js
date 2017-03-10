import React, { PropTypes } from 'react';
import { BaseComponent } from 'components/Base';
import {
  Row, Col, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';
import fields from './account.fields';
import { reduxForm } from 'redux-form';


export const FORM_NAME = 'accountForm';

@reduxForm({ form: FORM_NAME, fields })
export default class AccountForm extends BaseComponent {

  static propTypes = {
    user: PropTypes.object,
    onSubmit: PropTypes.func
  }

  componentDidMount() {
    const { initializeForm, user } = this.props;
    initializeForm(user);
  }

  render() {
    const { fields: { name } } = this.props;
    return (
      <Row>
        <Col sm={12}>
          <FormGroup>
            <Col sm={6}>
              <h4>User Details</h4>
              <ControlLabel>Name</ControlLabel>
              <FormControl type="text" placeholder="Name" {...name} />
            </Col>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}
