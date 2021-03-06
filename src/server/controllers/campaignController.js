const url = require('url');
const qs = require('querystring');
const campaignService = require('../services/campaignService');
const handleError = require('../utils/handleError');

function* list(req, res, next) {
  const parsedQuery = url.parse(req.originalUrl, true).query;
  const query = qs.stringify(Object.assign({}, parsedQuery, { type: 'EME' }));
  try {
    const campaigns = yield campaignService.fetchCampaigns(query, res);
    res.json(campaigns);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* read(req, res, next) {
  const query = url.parse(req.originalUrl).query;
  const campaignId = req.params.campaignId;
  try {
    const campaign = yield campaignService.fetchCampaign(campaignId, query);
    res.json(campaign);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* create(req, res, next) {
  const body = Object.assign({}, req.body, { type: 'EME' });
  try {
    const campaign = yield campaignService.createCampaign(body);
    res.json(campaign);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* patch(req, res, next) {
  const campaignId = req.params.campaignId;
  const body = Object.assign({}, req.body, { type: 'EME' });
  try {
    const campaign = yield campaignService.patchCampaign(campaignId, body);
    res.json(campaign);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* deleteCampaign(req, res, next) {
  const campaignId = req.params.campaignId;
  try {
    const campaign = yield campaignService.deleteCampaign(campaignId);
    res.json(campaign);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

module.exports = {
  list,
  read,
  create,
  patch,
  deleteCampaign
};
