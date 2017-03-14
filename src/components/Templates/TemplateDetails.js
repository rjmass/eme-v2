import React, { PropTypes } from 'react';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { initialize, getValues } from 'redux-form';
import { push } from 'react-router-redux';
import config from 'config';
import {
  templateLoadThunk, templateUpdateThunk, templateValidationError,
  templateDeleteThunk, templateCloneThunk
} from 'redux/modules/templates';
import { createEmailFromTemplateThunk } from 'redux/modules/emails';
import { Row, Col } from 'react-bootstrap';
import TemplateForm from './TemplateForm';
import { Preview } from 'components/Preview';
import schema from './template.schema';
import fields from './template.fields';
import { Spinner } from 'components/Spinner';
import { Message } from 'components/Message';
import TemplateBase from './TemplateBase';
import TemplateActions from './TemplateActions';
import TemplateConfirmCloneDialog from './TemplateConfirmCloneDialog';
import TemplateConfirmDeleteDialog from './TemplateConfirmDeleteDialog';
import TemplateConfirmGenerateEmailDialog from './TemplateConfirmGenerateEmailDialog';
import validator from 'components/Validator/validator';

const FORM_NAME = 'templateForm';

export class TemplateDetails extends TemplateBase {
  static propTypes = {
    list: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
  }

  static get contextTypes() {
    return { router: React.PropTypes.object };
  }

  componentDidMount() {
    const { params: { id } } = this.props;
    this.fetchTemplate(id);
  }

  componentWillReceiveProps(nextProps) {
    const { params: { id: oldId }, dispatch, list: oldList } = this.props;
    const { params: { id: nextId }, list: nextList } = nextProps;

    const currentTemplate = oldList[oldId];
    const nextTemplate = nextList[nextId];

    if (!isEqual(currentTemplate, nextTemplate)) {
      dispatch(initialize(FORM_NAME, nextTemplate, fields));
    }
  }

  fetchTemplate(id) {
    const { dispatch } = this.props;
    dispatch(templateLoadThunk(id));
  }

  async handleDelete() {
    const { params: { id }, dispatch } = this.props;
    this.closeDialog('delete');
    await dispatch(templateDeleteThunk(id));
    await dispatch(push(`${config.urlInfix}/templates`));
  }

  async cloneTemplate() {
    const { dispatch, params: { id } } = this.props;
    const clonedTemplate = await dispatch(templateCloneThunk(id));
    await dispatch(push(`${config.urlInfix}/templates/${clonedTemplate._id}`));
  }

  async handleSaveAndClone() {
    const { dispatch, form, params: { id } } = this.props;
    const newTemplate = getValues(form.templateForm);
    const valid = validator.validate(newTemplate, schema);
    this.closeDialog('clone');
    if (valid) {
      await dispatch(templateUpdateThunk(id, newTemplate));
      return await this.cloneTemplate();
    }
    return dispatch(templateValidationError(validator.error));
  }

  async handleCloneAction() {
    if (this.isTemplateDirty()) {
      return this.openDialog('clone');
    }
    return await this.cloneTemplate();
  }

  async generateEmail() {
    const { dispatch, params: { id } } = this.props;
    const newEmail = await dispatch(createEmailFromTemplateThunk(id));
    await dispatch(push(`${config.urlInfix}/emails/${newEmail._id}`));
  }

  async handleGenerateEmail() {
    const { dispatch, form, params: { id } } = this.props;
    const newTemplate = getValues(form.templateForm);
    const valid = validator.validate(newTemplate, schema);
    this.closeDialog('generate');
    if (valid) {
      await dispatch(templateUpdateThunk(id, newTemplate));
      return await this.generateEmail();
    }
    return dispatch(templateValidationError(validator.error));
  }

  async handleGenerateEmailAction() {
    if (this.isTemplateDirty()) {
      return this.openDialog('generate');
    }
    return await this.generateEmail();
  }

  isTemplateDirty() {
    const { form: { templateForm } } = this.props;
    return this.isFormDirty(templateForm);
  }

  async handleFormSave(template) {
    const newTemplate = { ...template, components: template.components.map(t => t._id) }
    // need to turn components into snippet IDS
    const { dispatch } = this.props;
    const valid = validator.validate(newTemplate, schema);
    if (valid) {
      const { params: { id } } = this.props;
      const updated = await dispatch(templateUpdateThunk(id, newTemplate));
      console.log(updated);
      return this.props.dispatch(initialize(FORM_NAME, updated, fields));
    }
    return dispatch(templateValidationError(validator.error));
  }

  render() {
    const { error, form, params: { id }, templateLoading } = this.props;
    const { templateForm = { htmlBody: '', plainBody: '' } } = form;
    const template = this.props.list[id] || {};
    const isSpinning = !template._id && templateLoading;

    return (
      <Row>
        <Spinner text={"Loading template..."} isVisible={isSpinning} />
        <Col className={isSpinning ? 'hidden' : 'show'} xs={12}>
          <div className="help-block" />
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Row>
                <Col xs={8}>
                  <h4>Editing: {template.name}</h4>
                </Col>
                <Col xs={4}>
                  <TemplateActions
                    className="pull-right"
                    onClone={() => this.handleCloneAction()}
                    onGenerateEmail={() => this.handleGenerateEmailAction()}
                    onDelete={() => this.openDialog('delete')}
                  />
                  {this.state.dialogs.clone &&
                    <TemplateConfirmCloneDialog
                      show={this.state.dialogs.clone}
                      onConfirm={() => this.handleSaveAndClone()}
                      onCancel={() => this.closeDialog('clone')}
                    />}
                    {this.state.dialogs.generate &&
                      <TemplateConfirmGenerateEmailDialog
                        show={this.state.dialogs.generate}
                        onConfirm={() => this.handleGenerateEmail()}
                        onCancel={() => this.closeDialog('generate')}
                      />}
                      {this.state.dialogs.delete &&
                        <TemplateConfirmDeleteDialog
                          show={this.state.dialogs.delete}
                          onConfirm={() => this.handleDelete()}
                          onCancel={() => this.closeDialog('delete')}
                        />}
                </Col>
              </Row>
              <div className="help-block" />
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              placeholder
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              {error ? <Message text={error.message} type="danger" /> : null}
              <TemplateForm
                activeTab={this.state.tab}
                onTabSelect={(key) => this.handleTabSelect(key)}
                template={template}
                onSubmit={(templateData) => this.handleFormSave(templateData)}
              />
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Preview
                activeTab={this.state.tab}
                onTabSelect={(key) => this.handleTabSelect(key)}
                html={templateForm.htmlBody.value}
                plain={templateForm.plainBody.value}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

@connect((state) => ({
  list: state.templates.list,
  error: state.templates.error,
  form: state.form,
  templateLoading: state.templates.templateLoading

}))
export default class TemplateDetailsConnected extends TemplateDetails { }
