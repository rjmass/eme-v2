import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { push } from 'react-router-redux';
import validator from 'components/Validator/validator';
import SubstitutionForm from './SubstitutionForm';
import schema from './substitution.schema';
import { substitutionCreateThunk, substitutionValidationError } from 'redux/modules/substitutions';
import { Message } from '../Message';
import config from 'config';

@connect((state) => ({
  error: state.substitutions.error,
}))
export default class SubstitutionCreate extends Component {

  async submitHandler(substitution) {
    const { dispatch } = this.props;
    const valid = validator.validate(substitution, schema);
    if (!valid) {
      return dispatch(substitutionValidationError(validator.error));
    }
    const newSubstitution = await dispatch(substitutionCreateThunk(substitution));
    return dispatch(push(`${config.urlInfix}/substitutions/${newSubstitution._id}`));
  }

  render() {
    const substitution = {};
    const { error } = this.props;
    return (
      <Row>
        <Col xs={12}>
          <Row>
            <Col xs={8}>
              <h4>Create Substitution</h4>
            </Col>
            <Col xs={4} />
          </Row>
          <Row>
            <Col xs={6} sm={6} md={4} lg={4}>
              {error ?
                <Message type="danger" text={error.message} />
                : null
              }
              <SubstitutionForm
                substitution={substitution}
                onSubmit={newSubstitution => this.submitHandler(newSubstitution)}
              />
            </Col>
          </Row>
        </Col>
      </Row>

    );
  }
}
