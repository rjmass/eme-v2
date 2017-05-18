import React, { Component } from 'react';
import { FormGroup, Form, Col, FormControl, Button, ControlLabel } from 'react-bootstrap';
import { reduxForm, change as changeField } from 'redux-form';
import fields from './campaign.fields';
import Switch from 'react-bootstrap-switch';

const FORM_NAME = 'campaignForm';

@reduxForm({ form: FORM_NAME, fields })
export default class CampaignForm extends Component {
  componentDidMount() {
    const { initializeForm, campaign } = this.props;
    initializeForm(campaign);
  }

  campaignUpdateHandler(archived) {
    const { dispatch } = this.props;
    dispatch(changeField(FORM_NAME, 'archived', archived));
  }
  render() {
    const { fields: { name, description, archived }, handleSubmit } = this.props;
    return (
      <Form horizontal onSubmit={(event) => handleSubmit(event)}>

        <FormGroup>
          <Col xs={2}>
            <ControlLabel>Name</ControlLabel>
          </Col>
          <Col xs={7}>
            <FormControl type="text" placeholder="name" {...name} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col xs={2}>
            <ControlLabel>Description</ControlLabel>
          </Col>
          <Col xs={7}>
            <FormControl type="text" placeholder="description" {...description} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col xs={2}>
            <ControlLabel>Archived</ControlLabel>
          </Col>
          <Col xs={7}>
            <div>
              <Switch
                value={archived.value}
                onChange={(_, v) => this.campaignUpdateHandler(v)}
              />
            </div>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={8}>
            <Button type="submit" bsStyle="primary">&nbsp;
              <span className="glyphicon glyphicon-floppy-save" />&nbsp;
              Save Campaign
            </Button>
          </Col>
        </FormGroup>

      </Form>
    );
  }
}
