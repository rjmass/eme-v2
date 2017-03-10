const config = require('../../config');
const fetcher = require('./_fetcher')(config.campaignsHost);

function* fetchCampaigns(query, res) {
  return yield fetcher.fetchResourceList('/campaigns', res, query);
}

function* fetchCampaign(campaignId, query) {
  return yield fetcher.fetchResourceSingle('/campaigns', campaignId, query);
}

function* createCampaign(campaignBody) {
  return yield fetcher.createResource('/campaigns', campaignBody);
}

function* patchCampaign(campaignId, campaignBody) {
  return yield fetcher.patchResource('/campaigns', campaignId, campaignBody);
}

function* deleteCampaign(campaignId) {
  return yield fetcher.deleteResource('/campaigns', campaignId);
}

module.exports = {
  fetchCampaigns,
  fetchCampaign,
  createCampaign,
  patchCampaign,
  deleteCampaign
};
