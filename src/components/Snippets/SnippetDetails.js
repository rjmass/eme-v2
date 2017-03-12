import React from 'react';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { initialize, getValues } from 'redux-form';
import { push } from 'react-router-redux';
import config from 'config';
import {
  snippetLoadThunk, snippetUpdateThunk, snippetValidationError,
  snippetValidationErrorThunk, snippetDeleteThunk, snippetCloneThunk
} from 'redux/modules/snippets';
import { Row, Col } from 'react-bootstrap';
import SnippetForm from './SnippetForm';
import { Preview } from 'components/Preview';
import schema from './snippet.schema';
import fields from './snippet.fields';
import { Message } from 'components/Message';
import SnippetBase from './SnippetBase';
import SnippetActions from './SnippetActions';
import SnippetConfirmDeleteDialog from './SnippetConfirmDeleteDialog';
import SnippetConfirmCloneDialog from './SnippetConfirmCloneDialog';
import validator from 'components/Validator/validator';

const FORM_NAME = 'snippetForm';

@connect((state) => ({
  list: state.snippets.list,
  error: state.snippets.error,
  form: state.form,
}))
export default class SnippetDetails extends SnippetBase {

  static get contextTypes() {
    return { router: React.PropTypes.object };
  }

  componentDidMount() {
    const { params: { id } } = this.props;
    this.fetchSnippet(id);
  }

  componentWillReceiveProps(nextProps) {
    const { params: { id: oldId }, dispatch, list: oldList } = this.props;
    const { params: { id: nextId }, list: nextList } = nextProps;

    const currentSnippet = oldList[oldId];
    const nextSnippet = nextList[nextId];

    if (!isEqual(currentSnippet, nextSnippet)) {
      dispatch(initialize(FORM_NAME, nextSnippet, fields));
    }
  }

  async cloneSnippet() {
    const { dispatch, params: { id } } = this.props;
    const resSnippet = await dispatch(snippetCloneThunk(id));
    await dispatch(push(`${config.urlInfix}/snippets/${resSnippet._id}`));
  }

  async handleSaveAndClone() {
    const { dispatch, form, params: { id } } = this.props;
    const newSnippet = getValues(form.snippetForm);
    const valid = validator.validate(newSnippet, schema);
    this.closeDialog('clone');
    if (valid) {
      await dispatch(snippetUpdateThunk(id, newSnippet));
      await dispatch(initialize(FORM_NAME, newSnippet, fields));
      return await this.cloneSnippet();
    }
    return dispatch(snippetValidationErrorThunk(validator.error));
  }

  async handleCloneAction() {
    if (this.isSnippetDirty()) {
      return this.openDialog('clone');
    }
    return await this.cloneSnippet();
  }

  fetchSnippet(id) {
    const { dispatch } = this.props;
    dispatch(snippetLoadThunk(id));
  }

  async handleDelete() {
    const { params: { id }, dispatch } = this.props;
    this.closeDialog('delete');
    await dispatch(snippetDeleteThunk(id));
    await dispatch(push(`${config.urlInfix}/snippets`));
  }

  isSnippetDirty() {
    const { form: { snippetForm } } = this.props;
    return this.isFormDirty(snippetForm);
  }

  async handleFormSave(snippet) {
    const { dispatch } = this.props;
    const valid = validator.validate(snippet, schema);
    if (valid) {
      const { params: { id } } = this.props;
      await dispatch(snippetUpdateThunk(id, snippet));
      return this.props.dispatch(initialize(FORM_NAME, snippet, fields));
    }
    return dispatch(snippetValidationError(validator.error));
  }

  render() {
    const { error, form, params: { id } } = this.props;
    const { snippetForm = { body: '', isHtml: '' } } = form;
    const snippet = this.props.list[id] || {};
    const previewActiveTab = snippetForm.isHtml.value ? 'html' : 'plain';

    if (snippet) {
      return (
        <Row>
          <Col xs={12}>
            <div className="help-block" />
            <Row>
              <Col xs={12} sm={12} md={6} lg={6}>
                <Row>
                  <Col xs={8}>
                    <h4>Editing snippet: {snippet.name}</h4>
                  </Col>
                  <Col xs={4}>
                    <SnippetActions
                      className="pull-right"
                      onClone={() => this.handleCloneAction()}
                      onDelete={() => this.openDialog('delete')}
                    />
                    {this.state.dialogs.delete &&
                      <SnippetConfirmDeleteDialog
                        show={this.state.dialogs.delete}
                        onCancel={() => this.closeDialog('delete')}
                        onConfirm={() => this.handleDelete()}
                      />}
                    {this.state.dialogs.clone &&
                      <SnippetConfirmCloneDialog
                        show={this.state.dialogs.clone}
                        onCancel={() => this.closeDialog('clone')}
                        onConfirm={() => this.handleSaveAndClone()}
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
                {error ?
                  <Message type="danger" text={error.message} />
                  : null
                }
                <SnippetForm
                  snippet={snippet}
                  onSubmit={(snippetData) => this.handleFormSave(snippetData)}
                />
              </Col>
              <Col xs={12} sm={12} md={6} lg={6}>
                <Preview
                  activeTab={previewActiveTab}
                  html={snippetForm.body.value}
                  plain={snippetForm.body.value}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      );
    }
    return null;
  }
}
