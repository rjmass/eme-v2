import React, { Component } from 'react';
import { reduxForm, change as changeField } from 'redux-form';
import {
  Form, FormGroup, Row, Col, FormControl, Button,
  ControlLabel, Tabs, Tab, Collapse
} from 'react-bootstrap';
import fields from './template.fields';
import { RichEditor } from 'components/Editor';
import { CampaignPicker } from 'components/Campaigns';
import debounce from 'lodash/debounce';

const FORM_NAME = 'templateForm';

@reduxForm({ form: FORM_NAME, fields })
export default class TemplateForm extends Component {
  constructor(...params) {
    super(...params);

    this.htmlUpdateHandler
      = debounce((html) => this._htmlUpdateHandler(html), 100);
    this.plainTextUpdateHandler
      = debounce((plainText) => this._plainTextUpdateHandler(plainText), 100);

    this.state = {};
  }

  componentDidMount() {
    const { initializeForm, template } = this.props;
    initializeForm(template);
  }

  _htmlUpdateHandler(newHtml) {
    const { dispatch } = this.props;
    dispatch(changeField(FORM_NAME, 'htmlBody', newHtml));
  }

  _plainTextUpdateHandler(newPlainText) {
    const { dispatch } = this.props;
    dispatch(changeField(FORM_NAME, 'plainBody', newPlainText));
  }

  handleCampaignSelect(campaignId) {
    const { dispatch } = this.props;
    dispatch(changeField(FORM_NAME, 'campaign', campaignId));
  }

  render() {
    const { fields: {
      name, subject, campaign,
      htmlBody, plainBody
    },
    handleSubmit, onTabSelect, activeTab } = this.props;
    return (
      <Row>
        <Col sm={12}>
          <Row>
            <Col sm={12}>
              <Button
                bsSize="xsmall"
                className="pull-right"
                onClick={() => this.setState({ formCollapsed: !this.state.formCollapsed })}
              >
                <i className={this.state.formCollapsed ? 'fa fa-plus' : 'fa fa-minus'} />
              </Button>
            </Col>
          </Row>
          <div className="help-block" />
          <Row>
            <Col sm={12}>
              <Form horizontal onSubmit={handleSubmit}>
                <Collapse in={!this.state.formCollapsed}>
                  <div className="form-collapsible form-pale">
                    <FormGroup>
                      <Col xs={6}>
                        <ControlLabel>Name</ControlLabel>
                        <FormControl type="text" placeholder="Name" {...name} />
                      </Col>
                      <Col sm={6}>
                        <ControlLabel>Briefing</ControlLabel>
                        <CampaignPicker
                          editable
                          value={campaign && campaign.value}
                          onSelect={(id) => this.handleCampaignSelect(id)}
                        />
                      </Col>
                    </FormGroup>

                    <FormGroup>
                      <Col xs={6}>
                        <ControlLabel>Subject</ControlLabel>
                        <FormControl type="text" placeholder="Subject" {...subject} />
                      </Col>
                    </FormGroup>
                  </div>
                </Collapse>

                <FormGroup>
                  <Col sm={12}>
                    <ControlLabel />
                    <Tabs
                      id="body-type-tabs"
                      defaultActiveKey={'html'}
                      activeKey={activeTab}
                      onSelect={onTabSelect}
                    >
                      <Tab eventKey={'html'} title="HTML">
                        <RichEditor
                          name="htmlBodyEditor"
                          articles={false}
                          contentArea
                          value={htmlBody.value}
                          onChange={this.htmlUpdateHandler}
                        />
                      </Tab>
                      <Tab eventKey={'plain'} title="Plain Text">
                        <RichEditor
                          html={false}
                          articles={false}
                          images={false}
                          fromHtmlSource={htmlBody.value}
                          name="plainBodyEditor"
                          value={plainBody.value}
                          onChange={this.plainTextUpdateHandler}
                        />
                      </Tab>
                    </Tabs>
                  </Col>
                </FormGroup>

                <FormGroup>
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
        </Col>
      </Row>
    );
  }

}
