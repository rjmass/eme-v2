const coExpress = require('co-express');
const express = require('express');
const template = require('../controllers/templateController');
const { notFound } = require('../middleware/errors');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();
const config = require('../../config');

module.exports = (app) => {
  router
    .use(coExpress(isAuthenticated))
    .route('/')
    .get(coExpress(template.list))
    .post(coExpress(template.create));
  router
    .route('/:templateId')
    .get(coExpress(template.read))
    .patch(coExpress(template.patch))
    .delete(coExpress(template.deleteTemplate));
  router
    .use(notFound);

  app.use(`${config.urlInfix}/api/templates`, router);
};
