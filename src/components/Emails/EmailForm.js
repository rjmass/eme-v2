import React, { Component, PropTypes } from 'react';
import { reduxForm, change as changeField } from 'redux-form';
import {
  Tabs, Tab, Form, FormGroup, Row,
  Col, FormControl, Button, Checkbox,
  ControlLabel, Collapse
} from 'react-bootstrap';
import baseFields from './email.fields';
import { RichEditor } from 'components/Editor';
import EmailFieldEditor from './EmailFieldEditor';
import { Message } from 'components/Message';
import debounce from 'lodash/debounce';
import { notifications } from 'redux/modules/notifications';
import './EmailPanel.css';

const FORM_NAME = 'emailForm';
const QUERY_LIMIT = 20;

export default class EmailForm extends Component {
  render() {
    const { email, onSubmit } = this.props;
    return (
      <EmailFieldForm
        email={email}
        onSubmit={onSubmit}
        fields={baseFields}
      />
    );
  }
}

@reduxForm({ form: FORM_NAME })
export class EmailFieldForm extends Component {

  static propTypes = {
    email: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.handleFieldChange
      = debounce((fieldName, fieldValue) => this._handleFieldChange(fieldName, fieldValue), 100);
    this.plainTextUpdateHandler
      = debounce((plainText) => this._plainTextUpdateHandler(plainText), 100);
    this.state = { formCollapsed: false };
  }

  componentDidMount() {
    const { initializeForm, email } = this.props;
    initializeForm(email);
  }

  _handleFieldChange(fieldName, fieldValue) {
    const { dispatch } = this.props;
    const { fields: { htmlFields } } = this.props;
    dispatch(changeField(FORM_NAME, 'htmlFields',
      { ...htmlFields.value, [fieldName]: fieldValue }));
  }

  handleRemoveQuery(i) {
    const { dispatch, fields: { queries } } = this.props;
    const newQuery = queries.value.list.slice();
    newQuery.splice(i, 1);
    if (!newQuery.length) {
      return dispatch(changeField(FORM_NAME, 'queries',
        { ...queries.value, activated: false, list: newQuery }));
    }
    return dispatch(changeField(FORM_NAME, 'queries', { ...queries.value, list: newQuery }));
  }

  handleUpdateQuery(i, q) {
    const { dispatch, fields: { queries } } = this.props;
    const newQuery = queries.value.list.slice();
    newQuery[i] = Object.assign({}, newQuery[i], q);
    dispatch(changeField(FORM_NAME, 'queries', { ...queries.value, list: newQuery }));
  }

  handleActivateQuery(val) {
    const { dispatch, fields: { queries } } = this.props;
    dispatch(changeField(FORM_NAME, 'queries', { ...queries.value, activated: val }));
  }

  handleAddQuery() {
    const { dispatch } = this.props;
    const { fields: { queries } } = this.props;
    const newQuery = queries.value.list.slice();
    if (newQuery.length === QUERY_LIMIT) {
      return dispatch(notifications.danger(`Maximum of ${QUERY_LIMIT} queries`));
    }
    newQuery.push({ type: 'CAPI', variableName: '', query: '', limit: '1DAYS' });
    return dispatch(changeField(FORM_NAME, 'queries', { ...queries.value, list: newQuery }));
  }

  handleCampaignSelect(campaignId) {
    const { dispatch } = this.props;
    dispatch(changeField(FORM_NAME, 'campaign', campaignId));
  }

  _plainTextUpdateHandler(newPlainText) {
    const { dispatch } = this.props;
    dispatch(changeField(FORM_NAME, 'plainBody', newPlainText));
  }

  handleCategorySelect(domain) {
    const { dispatch } = this.props;
    dispatch(changeField(FORM_NAME, 'from.address', domain));
  }

  render() {
    const { handleSubmit, fields: {
      name, subject,
      htmlFields, segmentId, queries,
      plainBody, htmlBody, autogeneratePlain },
      onContentTabSelect, activeContentTab } = this.props;
    return (
      <Row>
        <Col sm={12}>
          <div className="help-block" />
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
                <Col sm={12}>
                  <Collapse in={!this.state.formCollapsed}>
                    <div className="form-collapsible form-pale">
                      <FormGroup>
                        <Col sm={6}>
                          <ControlLabel>Name</ControlLabel>
                          <FormControl type="text" placeholder="Name" {...name} />
                        </Col>
                        <Col sm={6}>
                          <ControlLabel>Subject</ControlLabel>
                          <FormControl type="text" placeholder="Subject" {...subject} />
                        </Col>
                      </FormGroup>

                      <FormGroup>
                        <Col sm={6}>
                          <ControlLabel>Segment Id</ControlLabel>
                          <FormControl type="text" placeholder="Segment Id" {...segmentId} />
                        </Col>
                      </FormGroup>

                      <FormGroup>
                        <Col xs={12}>
                          <Checkbox
                            type="checkbox"
                            checked={autogeneratePlain}
                            {...autogeneratePlain}
                          >
                            Autogenerate plain text from html
                          </Checkbox>
                        </Col>
                      </FormGroup>
                    </div>
                  </Collapse>

                  <Row />

                  <div className="help-block" />

                  <Tabs
                    id="email-content"
                    defaultActiveKey={'html'}
                    activeKey={activeContentTab}
                    onSelect={onContentTabSelect}
                  >
                    <Tab eventKey="html" title="HTML Fields">
                      <div className="help-block" />
                      <EmailFieldEditor
                        htmlFields={htmlFields.value}
                        onFieldChanged={(field, val) => this.handleFieldChange(field, val)}
                      />
                    </Tab>
                    <Tab eventKey="plain" title="Plain Text">
                      <RichEditor
                        html={false}
                        images={false}
                        articles={false}
                        name="plainBodyEditor"
                        value={plainBody.value}
                        fromHtmlSource={htmlBody.value}
                        fromHtmlFields={htmlFields.value}
                        onChange={this.plainTextUpdateHandler}
                      />
                    </Tab>
                  </Tabs>

                  <div className="help-block" />

                  {htmlFields.value && !Object.keys(htmlFields.value).length
                    ? <Message type="info" text="This email does not contain any Content Areas" />
                    : null}
                </Col>
                <Col sm={6}>
                  <Button className="pull-left" type="submit" bsStyle="primary">&nbsp;
                    <span className="glyphicon glyphicon-floppy-save" />&nbsp;
                    Save
                  </Button>
                </Col>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}