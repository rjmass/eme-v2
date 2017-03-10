import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { snippetCreateThunk, snippetValidationError } from 'redux/modules/snippets';
import SnippetForm from './SnippetForm';
import { HtmlPreview, PlainPreview } from 'components/Preview';
import validator from 'components/Validator/validator';
import schema from './snippet.schema';
import config from 'config';
import { Message } from '../Message';
import SnippetBase from './SnippetBase';
import { push } from 'react-router-redux';

@connect((state) => ({
  error: state.snippets.error,
  form: state.form,
}))
export default class SnippetCreate extends SnippetBase {

  async submitHandler(snippet) {
    const { dispatch } = this.props;
    const valid = validator.validate(snippet, schema);

    if (!valid) {
      return dispatch(snippetValidationError(validator.error));
    }

    const newSnippet = await dispatch(snippetCreateThunk(snippet));
    return dispatch(push(`${config.urlInfix}/snippets/${newSnippet._id}`));
  }

  get emptySnippet() {
    return {
      name: '',
      description: '',
      isHtml: true,
      body: ''
    };
  }

  render() {
    const snippet = this.emptySnippet;
    const { error, form } = this.props;
    const { snippetForm = { body: '', isHtml: true } } = form;

    return (
      <Row>
        <Col xs={12}>
          <div className="help-block" />
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              <h4>Create snippet</h4>
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
                onSubmit={(subSnippet) => this.submitHandler(subSnippet)}
              />
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <strong>Preview: </strong>
              {(snippetForm.isHtml.value)
                ? <HtmlPreview body={snippetForm.body.value} />
                : <PlainPreview body={snippetForm.body.value} />}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

}
