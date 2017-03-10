import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { push } from 'react-router-redux';
import validator from 'components/Validator/validator';
import CampaignForm from './CampaignForm';
import schema from './campaign.schema';
import { campaignCreateThunk, campaignValidationError } from 'redux/modules/campaigns';
import { Message } from '../Message';
import config from 'config';

@connect((state) => ({
  error: state.campaigns.error,
}))
export default class campaignCreate extends Component {

  async submitHandler(campaign) {
    const { dispatch } = this.props;
    const valid = validator.validate(campaign, schema);
    if (!valid) {
      return dispatch(campaignValidationError(validator.error));
    }
    const newcampaign = await dispatch(campaignCreateThunk(campaign));
    return dispatch(push(`${config.urlInfix}/campaigns/${newcampaign._id}`));
  }

  render() {
    const campaign = {};
    const { error } = this.props;
    return (
      <Row>
        <Col xs={12}>
          <Row>
            <Col xs={8}>
              <h4>Create campaign</h4>
            </Col>
            <Col xs={4} />
          </Row>
          <Row>
            <Col xs={6} sm={6} md={4} lg={4}>
              {error ?
                <Message type="danger" text={error.message} />
                : null
              }
              <CampaignForm
                campaign={campaign}
                onSubmit={newcampaign => this.submitHandler(newcampaign)}
              />
            </Col>
          </Row>
        </Col>
      </Row>

    );
  }
}
