import React, { Component } from 'react';
import { FormGroup, Form, Col, FormControl, Button, ControlLabel } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import fields from './substitution.fields';

const FORM_NAME = 'substitutionForm';

@reduxForm({ form: FORM_NAME, fields })
export default class SubstitutionForm extends Component {
  componentDidMount() {
    const { initializeForm, substitution } = this.props;
    initializeForm(substitution);
  }

  render() {
    const { fields: { name, description }, handleSubmit } = this.props;
    return (
      <Form horizontal onSubmit={(event) => handleSubmit(event)}>
        <FormGroup>
          <Col xs={3}>
            <ControlLabel>Name</ControlLabel>
          </Col>
          <Col xs={9}>
            <FormControl type="text" placeholder="name" {...name} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col xs={3}>
            <ControlLabel>Description</ControlLabel>
          </Col>
          <Col xs={9}>
            <FormControl type="text" placeholder="description" {...description} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={8}>
            <Button type="submit" bsStyle="primary">&nbsp;
              <span className="glyphicon glyphicon-floppy-save" />&nbsp;
              Save List
            </Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
