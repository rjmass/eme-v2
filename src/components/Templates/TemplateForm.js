import React, { Component } from 'react';
import { reduxForm, change as changeField } from 'redux-form';
import {
  Tab, Tabs, Form, FormGroup, Row, Col, FormControl, Button,
  ControlLabel, Collapse
} from 'react-bootstrap';
import fields from './template.fields';
import { RichEditor } from 'components/Editor';
import { notifications } from 'redux/modules/notifications';
import { CampaignPicker } from 'components/Campaigns';
import TemplateDragContainer from './TemplateDragContainer';
import TemplateAuthors from './TemplateAuthors';
import debounce from 'lodash/debounce';

const FORM_NAME = 'templateForm';
const AUTHOR_LIMIT = 20;

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

  handleComponentChange(components) {
    const { dispatch } = this.props;
    dispatch(changeField(FORM_NAME, 'components', components));
  }

  handleAddAuthor() {
    const { dispatch } = this.props;
    const { fields: templateFields } = this.props.fields;
    const authors = templateFields.value && templateFields.value.authors || [];
    const newAuthors = authors.slice();
    console.log(newAuthors);
    if (newAuthors.length === AUTHOR_LIMIT) {
      return dispatch(notifications.danger(`Maximum of ${AUTHOR_LIMIT} queries`));
    }
    newAuthors.push({ name: '', photo: '', authorURL: '' });
    return dispatch(changeField(FORM_NAME, 'fields', { ...templateFields.value,
      authors: newAuthors }));
  }

  handleUpdateAuthor(i, q) {
    const { dispatch, fields: { fields: templateFields } } = this.props;
    const newAuthors = templateFields.value.authors.slice();
    newAuthors[i] = Object.assign({}, newAuthors[i], q);
    dispatch(changeField(FORM_NAME, 'fields', { ...templateFields.value,
      authors: newAuthors }));
  }

  handleRemoveAuthor(i) {
    const { dispatch, fields: { fields: templateFields } } = this.props;
    const newAuthors = templateFields.value.authors.slice();
    newAuthors.splice(i, 1);
    dispatch(changeField(FORM_NAME, 'fields', { ...templateFields.value,
      authors: newAuthors }));
  }

  render() {
    const { fields: {
      name, subject, campaign,
      htmlBody, components, fields: templateFields
    }, handleSubmit, activeTab, onTabSelect } = this.props;

    const authors = templateFields.value && templateFields.value.authors || [];

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
                  <Tabs
                    id="template-fields"
                    defaultActiveKey={'properties'}
                    activeKey={activeTab}
                    onSelect={onTabSelect}
                  >
                    <Tab eventKey="properties" title="Properties">
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
                    </Tab>
                    <Tab eventKey="authors" title="Authors">
                      <TemplateAuthors
                        authors={authors}
                        onAuthorAdd={() => this.handleAddAuthor()}
                        onAuthorUpdate={(i, q) => this.handleUpdateAuthor(i, q)}
                        onAuthorRemove={(i) => this.handleRemoveAuthor(i)}
                      />
                    </Tab>
                  </Tabs>
                </Collapse>

                <FormGroup>
                  <Col sm={12}>
                    <ControlLabel />
                    <TemplateDragContainer
                      htmlString={htmlBody.value}
                      cards={components.value}
                      onChange={(newHTML, newComponents) => {
                        this.htmlUpdateHandler(newHTML);
                        this.handleComponentChange(newComponents);
                      }}
                    />

                    <ControlLabel />
                    <RichEditor
                      name="htmlBodyEditor"
                      articles={false}
                      contentArea
                      value={htmlBody.value}
                      onChange={() => {}}
                    />
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
