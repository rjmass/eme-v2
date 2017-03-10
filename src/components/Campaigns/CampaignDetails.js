import React, { PropTypes, Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { initialize } from 'redux-form';
import { Message } from 'components/Message';
import fields from './campaign.fields';
import schema from './campaign.schema';
import CampaignForm from './CampaignForm';
import { campaignLoadThunk, campaignUpdateThunk,
  campaignValidationError
} from 'redux/modules/campaigns';
import validator from 'components/Validator/validator';
import { Spinner } from 'components/Spinner';

const FORM_NAME = 'campaignForm';

class CampaignDetails extends Component {

  static propTypes = {
    campaign: PropTypes.object
  }

  componentDidMount() {
    const { params: { id } } = this.props;
    this.fetchCampaign(id);
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

  fetchCampaign(id) {
    const { dispatch } = this.props;
    dispatch(campaignLoadThunk(id));
  }

  async handleFormSave(campaign) {
    const { dispatch } = this.props;
    const valid = validator.validate(campaign, schema);
    if (valid) {
      const { params: { id } } = this.props;
      await dispatch(campaignUpdateThunk(id, campaign));
      return dispatch(initialize(FORM_NAME, campaign, fields));
    }
    return dispatch(campaignValidationError(validator.error));
  }

  render() {
    const { params: { id }, error, campaignLoading } = this.props;
    const campaign = this.props.list[id] || {};
    const isSpinning = !campaign._id && campaignLoading;
    return (
      <Row>
        <Spinner text={"Loading campaigns..."} isVisible={isSpinning} />
        <Col xs={12}>
          <div className="help-block" />
          <Row>
            <Col xs={4}>
              <h4>Editing: {campaign.name}</h4>
            </Col>
          </Row>
          <div className="help-block" />
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              {error ?
                <Message type="danger" text={error.message} />
                : null
              }
              <CampaignForm
                campaign={campaign}
                onSubmit={newCampaign => this.handleFormSave(newCampaign)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

@connect(state => ({
  list: state.campaigns.list,
  error: state.campaigns.error,
  campaignLoading: state.campaigns.campaignLoading
}))
export default class CampaignDetailsConnected extends CampaignDetails { }
