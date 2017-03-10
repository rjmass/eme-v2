import React, { PropTypes } from 'react';
import { BaseComponent } from 'components/Base';
import { Row, Col, FormGroup, Checkbox } from 'react-bootstrap';
import fields from './account.fields';
import { reduxForm } from 'redux-form';


export const FORM_NAME = 'accountForm';

@reduxForm({ form: FORM_NAME, fields })
export default class PreferencesForm extends BaseComponent {

  static propTypes = {
    user: PropTypes.object,
  }

  componentDidMount() {
    const { initializeForm, user } = this.props;
    initializeForm(user);
  }

  render() {
    const { fields: { preferences } } = this.props;
    return (
      <Row>
        <Col sm={12}>

          <FormGroup>
            <Col sm={6}>
              <h4>Preferences</h4>
              <Checkbox
                checked={!preferences.confirmEmailSave}
                {...preferences.confirmEmailSave}
              >
                Confirm prior to saving emails
              </Checkbox>
            </Col>
          </FormGroup>

        </Col>
      </Row>
    );
  }
}
