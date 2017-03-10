const coExpress = require('co-express');
const express = require('express');
const savedEmails = require('../controllers/savedEmailController');
const { notFound } = require('../middleware/errors');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();
const config = require('../../config');

module.exports = (app) => {
  router
    .use(coExpress(isAuthenticated))
    .route('/:substitutionId')
    .get(coExpress(savedEmails.read));
  router
    .use(notFound);

  app.use(`${config.urlInfix}/api/savedEmails`, router);
};
