const coExpress = require('co-express');
const express = require('express');
const queries = require('../controllers/queryController');
const { notFound } = require('../middleware/errors');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();
const config = require('../../config');

module.exports = (app) => {
  router
    .use(coExpress(isAuthenticated))
    .route('/')
    .get(coExpress(queries.list))
    .post(coExpress(queries.create));
  router
    .route('/:queryId')
    .get(coExpress(queries.read))
    .patch(coExpress(queries.patch))
    .delete(coExpress(queries.deleteQuery));
  router
    .use(notFound);

  router.param('queryId', coExpress(queries.queryById));
  app.use(`${config.urlInfix}/api/queries`, router);
};
