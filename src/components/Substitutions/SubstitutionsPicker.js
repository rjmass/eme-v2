import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Row, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import {
  substitutionsEnableThunk, substitutionsDisable, substitutionLoadSelectThunk,
  substitutionDataSelected, getSubstitutions, getSubstitution, substitutionDataReset
} from 'redux/modules/substitutions';
import Switch from 'react-bootstrap-switch';
import { ListPicker, RecipientPicker } from 'components/Substitutions';

import 'react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';

@connect((state) => ({
  substitutions: {
    ...state.substitutions,
    list: getSubstitutions(state.substitutions),
    substitution: getSubstitution(state.substitutions)
  },
}))
export default class SubstitutionsPicker extends Component {

  toggleSubstitutionsHandler(enabled) {
    const { dispatch } = this.props;
    if (enabled) {
      dispatch(substitutionsEnableThunk());
    } else {
      dispatch(substitutionsDisable());
      dispatch(substitutionDataReset());
    }
  }

  substitutionsSelectionHandler(listId) {
    const { dispatch } = this.props;
    if (listId) {
      dispatch(substitutionLoadSelectThunk(listId));
    } else {
      dispatch(substitutionDataReset());
    }
  }

  substitutionDataSelectionHandler(index) {
    const { dispatch } = this.props;
    dispatch(substitutionDataSelected(index));
  }

  render() {
    const { substitutions } = this.props;
    const substitutionDataExists = substitutions.substitution &&
      substitutions.substitution.data &&
      substitutions.substitution.data.length;
    const selectedListId = substitutions.substitutionSelected;
    const recipients = substitutionDataExists
      ? substitutions.substitution.data
      : [];
    const recipientsDisabled = !substitutions.enabled || !substitutions.substitutionSelected;
    const recipient = substitutions.substitutionDataSelected;

    return (
      <Form>
        <Row>
          <Col xs={4}>
            <FormGroup>
              <ControlLabel>Use substitutions</ControlLabel>
              <div>
                <Switch
                  state={substitutions.enabled}
                  onChange={(switchEnabled) => this.toggleSubstitutionsHandler(switchEnabled)}
                />
              </div>
            </FormGroup>
          </Col>
          <Col xs={4}>
            <FormGroup>
              <ControlLabel>Lists</ControlLabel>
              <ListPicker
                value={selectedListId}
                onSelect={(listId) => this.substitutionsSelectionHandler(listId)}
                disabled={!substitutions.enabled}
              />
            </FormGroup>
          </Col>
          <Col xs={4}>
            <FormGroup>
              <ControlLabel>Recipient</ControlLabel>
              <RecipientPicker
                value={recipient}
                list={recipients}
                onSelect={(index) => this.substitutionDataSelectionHandler(index)}
                disabled={recipientsDisabled}
              />
            </FormGroup>
          </Col>
        </Row>
      </Form>
    );
  }
}
