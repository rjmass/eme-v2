const coExpress = require('co-express');
const express = require('express');
const substitutions = require('../controllers/substitutionController');
const { notFound } = require('../middleware/errors');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();
const config = require('../../config');

module.exports = (app) => {
  router
    .use(coExpress(isAuthenticated))
    .route('/')
    .get(coExpress(substitutions.list))
    .post(coExpress(substitutions.create));
  router
    .route('/:substitutionId/data')
    .get(coExpress(substitutions.readData));
  router
    .route('/:substitutionId')
    .get(coExpress(substitutions.read))
    .patch(coExpress(substitutions.patch))
    .delete(coExpress(substitutions.deleteSubstitution));
  router
    .use(notFound);

  app.use(`${config.urlInfix}/api/substitutions`, router);
};
