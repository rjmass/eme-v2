import React, { Component } from 'react';
import { reduxForm, change as changeField } from 'redux-form';
import {
  Form, FormGroup, Row, Col, FormControl, Button,
  ControlLabel, Collapse
} from 'react-bootstrap';
import fields from './snippet.fields';
import { RichEditor } from 'components/Editor';
import debounce from 'lodash/debounce';
import SnippetTypeSelector from './SnippetTypeSelector';
import getLodashVars from 'helpers/getLodashVars';
import renderTemplate from 'helpers/renderTemplate';

const FORM_NAME = 'snippetForm';

@reduxForm({ form: FORM_NAME, fields })
export default class SnippetForm extends Component {
  constructor(...params) {
    super(...params);
    this.bodyUpdateHandler = debounce((body) => this._bodyUpdateHandler(body), 100);
    this.isHtmlUpdateHandler = debounce((v) => this._isHtmlUpdateHandler(v), 100);
    this.state = { snippetType: null, snippetFields: {} };
  }

  componentDidMount() {
    const { initializeForm, snippet } = this.props;
    initializeForm(snippet);
  }

  _bodyUpdateHandler(newBody) {
    const { dispatch } = this.props;
    dispatch(changeField(FORM_NAME, 'body', newBody));
  }

  _isHtmlUpdateHandler(val) {
    const { dispatch } = this.props;
    dispatch(changeField(FORM_NAME, 'isHtml', val));
  }

  handleSnippetTypeSelect(snippet) {
    const { dispatch } = this.props;
    const snippetFields = {};
    if (snippet) {
      for (const field of getLodashVars(snippet.body)) {
        snippetFields[field] = '';
      }
    }
    this.setState({ snippetType: snippet, snippetFields });
    dispatch(changeField(FORM_NAME, 'body', snippet.body));
  }

  handleSnippetFieldChange(v, snip) {
    const { dispatch } = this.props;
    const snippetFields = { ...this.state.snippetFields, [snip]: v };
    const newBody = renderTemplate(this.state.snippetType.body, snippetFields);
    this.setState({ snippetFields });
    dispatch(changeField(FORM_NAME, 'body', newBody));
  }

  get snippetFields() {
    return Object.keys(this.state.snippetFields).map((snip, i) => {
      const snipDisplay = snip.replace(/_/g, ' ');
      return (
        <FormGroup key={i}>
          <Col sm={6}>
            <ControlLabel>{snipDisplay}</ControlLabel>
            <FormControl
              type="text"
              placeholder={snipDisplay}
              onChange={(v) => this.handleSnippetFieldChange(v.target.value, snip)}
            />
          </Col>
        </FormGroup>
      );
    });
  }

  render() {
    const { fields: { name, description, body, isHtml },
      handleSubmit } = this.props;
    const { snippetType } = this.state;

    return (
      <Row>
        <Col sm={12}>
          <Row>
            <Button
              bsSize="xsmall"
              className="pull-right"
              onClick={() => this.setState({ formCollapsed: !this.state.formCollapsed })}
            >
              <i className={this.state.formCollapsed ? 'fa fa-plus' : 'fa fa-minus'} />
            </Button>
          </Row>
          <div className="help-block" />
          <Row>
            <Form horizontal onSubmit={handleSubmit}>
              <Collapse in={!this.state.formCollapsed}>
                <div className="form-collapsible form-pale">
                  <FormGroup>
                    <Col sm={6}>
                      <ControlLabel>Name</ControlLabel>
                      <FormControl type="text" placeholder="Name" {...name} />
                    </Col>
                    <Col sm={6}>
                      <ControlLabel>Description</ControlLabel>
                      <FormControl type="text" placeholder="Description" {...description} />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col sm={6}>
                      <ControlLabel>Snippet Type</ControlLabel>
                      <SnippetTypeSelector
                        onSelect={(s) => this.handleSnippetTypeSelect(s)}
                        value={snippetType}
                      />
                    </Col>
                  </FormGroup>
                  {this.snippetFields}
                </div>

              </Collapse>

              <FormGroup>
                <Col sm={12}>
                  <ControlLabel>Body</ControlLabel>
                  <RichEditor
                    html={Boolean(isHtml.value)}
                    name="htmlBodyEditor"
                    snippets={false}
                    value={body.value}
                    onChange={this.bodyUpdateHandler}
                  />
                </Col>
              </FormGroup>

              <FormGroup>
                <Col sm={8}>
                  <Button type="submit" bsStyle="primary">&nbsp;
                    <span className="glyphicon glyphicon-floppy-save" />&nbsp;
                    Save Snippet
                  </Button>
                </Col>
              </FormGroup>
            </Form>
          </Row>
        </Col>
      </Row>

    );
  }
}
