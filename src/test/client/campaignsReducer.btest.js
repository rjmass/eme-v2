import { expect } from 'chai';
import reducer, * as actions from 'redux/modules/campaigns';
import campaigns from 'test/fixtures/campaigns';
import campaignsNormalized from 'test/fixtures/campaignsNormalized';

const initialState = actions.initialState;
const [activeCampaign, , archivedCampaign] = campaigns;

describe('Campaign reducer', () => {
  it('returns an initial state', () => {
    expect(reducer(undefined, {})).to.eql(initialState);
  });

  it('handles CAMPAIGN_LOAD', () => {
    const expectedState = { ...initialState, campaignLoading: true };
    expect(reducer(initialState, { type: actions.CAMPAIGN_LOAD })).to.eql(expectedState);
  });

  it('handles CAMPAIGNS_LOAD', () => {
    const expectedState = { ...initialState, listLoading: true };
    expect(reducer(initialState, { type: actions.CAMPAIGNS_LOAD })).to.eql(expectedState);
  });

  it('handles CAMPAIGN_LOADED', () => {
    const expectedState = {
      ...initialState,
      list: { ...initialState.list, [activeCampaign._id]: activeCampaign },
      error: null,
      campaignLoading: false
    };
    expect(
      reducer(initialState, { type: actions.CAMPAIGN_LOADED, campaign: activeCampaign })
    ).to.eql(expectedState);
  });

  it('handles CAMPAIGNS_LOADED', () => {
    const expectedState = {
      ...initialState,
      list: campaignsNormalized,
      error: null,
      campaignLoading: false
    };
    expect(
      reducer(initialState, { type: actions.CAMPAIGNS_LOADED, campaigns: campaignsNormalized })
    ).to.eql(expectedState);
  });

  it('handles CAMPAIGNS_FILTER', () => {
    const filter = { name: 'example' };
    const expectedState = { ...initialState, filter };
    expect(
      reducer(initialState, { type: actions.CAMPAIGNS_FILTER, filter })
    ).to.eql(expectedState);
  });

  it('handles CAMPAIGN_LOAD', () => {
    const expectedState = { ...initialState, campaignLoading: true };
    expect(reducer(initialState, { type: actions.CAMPAIGN_LOAD })).to.eql(expectedState);
  });


  it('handles CAMPAIGN_VALIDATION_ERROR', () => {
    const error = { message: 'problem' };
    const expectedState = { ...initialState, error };
    expect(
      reducer(initialState, { type: actions.CAMPAIGN_VALIDATION_ERROR, error })
    ).to.eql(expectedState);
  });

  it('handles CAMPAIGN_SERVER_ERROR', () => {
    const error = { message: 'problem' };
    const expectedState = { ...initialState, error };
    expect(
      reducer(initialState, { type: actions.CAMPAIGN_SERVER_ERROR, error })
    ).to.eql(expectedState);
  });

  it('handles CAMPAIGN_DELETED', () => {
    const id = activeCampaign._id;
    const startingState = reducer(initialState,
      { type: actions.CAMPAIGN_LOADED, campaign: activeCampaign });
    const nextState = reducer(startingState,
      { type: actions.CAMPAIGN_LOADED, campaign: archivedCampaign });
    const deletedState = reducer(nextState,
      { type: actions.CAMPAIGN_DELETED, id });
    expect(Object.keys(startingState.list).length).to.eql(1);
    expect(Object.keys(nextState.list).length).to.eql(2);
    expect(Object.keys(deletedState.list).length).to.eql(1);
    expect(deletedState.list[id]).to.not.exist;
  });

  it('gets all existingCampaigns', () => {
    const state = { ...actions.initialState, list: campaignsNormalized };
    const existingCampaigns = actions.getCampaigns(state);
    expect(existingCampaigns.length).to.eql(3);
  });

  it('gets active campaigns only', () => {
    const state = { ...actions.initialState, list: campaignsNormalized };
    const existingCampaigns = actions.getCampaigns(state, true);
    expect(existingCampaigns.length).to.eql(2);
  });
});
