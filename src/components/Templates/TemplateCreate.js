import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { templateCreateThunk, templateValidationError } from 'redux/modules/templates';
import { getSubstitutionData } from 'redux/modules/substitutions';
import TemplateForm from './TemplateForm';
import { Preview } from 'components/Preview';
import validator from 'components/Validator/validator';
import schema from './template.schema';
import { Message } from '../Message';
import TemplateBase from './TemplateBase';
import { SubstitutionsPicker } from 'components/Substitutions';
import { push } from 'react-router-redux';
import config from 'config';

@connect((state) => ({
  error: state.templates.error,
  form: state.form,
  substitutions: state.substitutions
}))
export default class TemplateCreate extends TemplateBase {

  async submitHandler(template) {
    const { dispatch } = this.props;
    const valid = validator.validate(template, schema);

    if (!valid) {
      return dispatch(templateValidationError(validator.error));
    }

    const newTemplate = await dispatch(templateCreateThunk(template));
    return dispatch(push(`${config.urlInfix}/templates/${newTemplate._id}`));
  }

  get emptyTemplate() {
    return {
      name: '',
      description: '',
      from: {
        address: null,
        name: '',
      },
      subject: '',
      htmlBody: '',
      plainBody: '',
      htmlFields: '',
      replyTo: ''
    };
  }

  render() {
    const template = this.emptyTemplate;
    const { error, form, substitutions } = this.props;
    const { templateForm = { htmlBody: '', plainBody: '' } } = form;
    const substitutionData = getSubstitutionData(substitutions);

    return (
      <Row>
        <Col xs={12}>
          <div className="help-block" />
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              <h4>Create template</h4>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <SubstitutionsPicker />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              {error ?
                <Message type="danger" text={error.message} />
                : null
              }
              <TemplateForm
                activeTab={this.state.tab}
                onTabSelect={(key) => this.handleTabSelect(key)}
                template={template}
                onSubmit={(subTemplate) => this.submitHandler(subTemplate)}
              />
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Preview
                activeTab={this.state.tab}
                onTabSelect={(key) => this.handleTabSelect(key)}
                html={templateForm.htmlBody.value}
                plain={templateForm.plainBody.value}
                substitutionData={substitutionData}
                substitutionEnabled={substitutions.enabled}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

}
