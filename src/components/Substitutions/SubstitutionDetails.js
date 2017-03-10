import React, { PropTypes, Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { initialize } from 'redux-form';
import { Message } from 'components/Message';
import fields from './substitution.fields';
import schema from './substitution.schema';
import SubstitutionForm from './SubstitutionForm';
import { substitutionLoadThunk, substitutionUpdateThunk,
  substitutionValidationError, substitutionDeleteThunk
} from 'redux/modules/substitutions';
import SubstitutionDataEditor from './SubstitutionDataEditor';
import SubstitutionActions from './SubstitutionActions';
import SubstitutionConfirmDeleteDialog from './SubstitutionConfirmDeleteDialog';
import { push } from 'react-router-redux';
import { dialogs } from 'decorators';
import { Spinner } from 'components/Spinner';
import config from 'config';
import validator from 'components/Validator/validator';

const FORM_NAME = 'substitutionForm';

@dialogs()
class SubstitutionDetails extends Component {

  static propTypes = {
    substitution: PropTypes.object
  }

  componentDidMount() {
    const { params: { id } } = this.props;
    this.fetchSubstitution(id);
  }

  componentWillReceiveProps(nextProps) {
    const { params: { id: oldId }, dispatch, list: oldList } = this.props;
    const { params: { id: nextId }, list: nextList } = nextProps;

    const currentSub = oldList[oldId];
    const nextSub = nextList[nextId];

    if (!isEqual(currentSub, nextSub)) {
      dispatch(initialize(FORM_NAME, nextSub, fields));
    }
  }

  fetchSubstitution(id) {
    const { dispatch } = this.props;
    dispatch(substitutionLoadThunk(id));
  }

  async handleFormSave(substitution, data) {
    const { dispatch } = this.props;
    const valid = validator.validate(substitution, schema);
    if (valid) {
      const { params: { id } } = this.props;
      await dispatch(substitutionUpdateThunk(id, substitution, data));
      return dispatch(initialize(FORM_NAME, substitution, fields));
    }
    return dispatch(substitutionValidationError(validator.error));
  }

  async handleCampaignDelete() {
    const { dispatch, params: { id } } = this.props;
    this.closeDialog('delete');
    await dispatch(substitutionDeleteThunk(id));
    await dispatch(push(`${config.urlInfix}/substitutions`));
  }

  render() {
    const { params: { id }, error, substitutionLoading } = this.props;
    const substitution = this.props.list[id] || {};
    const substitutionLength = Object.keys(substitution.data || []).length;
    return (
      <Row>
        <Spinner text={"Loading..."} isVisible={substitutionLoading} />
        <Col className={substitutionLoading ? 'hidden' : 'show'} xs={12}>
          <div className="help-block" />
          <Row>
            <Col xs={4}>
              <h4>Editing: {substitution.name}</h4>
            </Col>
            <Col xs={2}>
              <h5>{substitutionLength ? `${substitutionLength} recipients` : ''}</h5>
            </Col>
            <Col xs={6}>
              {this.state.dialogs.delete &&
                <SubstitutionConfirmDeleteDialog
                  show={this.state.dialogs.delete}
                  onCancel={() => this.closeDialog('delete')}
                  onConfirm={() => this.handleCampaignDelete()}
                />}
              <SubstitutionActions
                className="pull-right"
                onDelete={() => this.openDialog('delete')}
              />
            </Col>
          </Row>
          <div className="help-block" />
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              {error ?
                <Message type="danger" text={error.message} />
                : null
              }
              <SubstitutionForm
                substitution={substitution}
                onSubmit={newSub => this.handleFormSave(newSub, substitution.data)}
              />
            </Col>
          </Row>
          <div className="help-block" />
          <Row>
            <Col xs={12}>
              {substitution && substitution.data ?
                <SubstitutionDataEditor
                  data={substitution.data}
                  substitutionId={id}
                />
              : null}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

@connect(state => ({
  list: state.substitutions.list,
  error: state.substitutions.error,
  substitutionLoading: state.substitutions.substitutionLoading
}))
export default class SubstitutionDetailsConnected extends SubstitutionDetails { }
