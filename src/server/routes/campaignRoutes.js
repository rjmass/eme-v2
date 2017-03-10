const coExpress = require('co-express');
const express = require('express');
const campaign = require('../controllers/campaignController');
const { notFound } = require('../middleware/errors');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();
const config = require('../../config');

module.exports = (app) => {
  router
    .use(coExpress(isAuthenticated))
    .route('/')
    .get(coExpress(campaign.list))
    .post(coExpress(campaign.create));
  router
    .route('/:campaignId')
    .get(coExpress(campaign.read))
    .patch(coExpress(campaign.patch))
    .delete(coExpress(campaign.deleteCampaign));
  router
    .use(notFound);

  app.use(`${config.urlInfix}/api/campaigns`, router);
};
