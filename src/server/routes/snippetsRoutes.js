const coExpress = require('co-express');
const express = require('express');
const snippets = require('../controllers/snippetController');
const { notFound } = require('../middleware/errors');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();
const config = require('../../config');

module.exports = (app) => {
  router
    .use(coExpress(isAuthenticated))
    .route('/')
    .get(coExpress(snippets.list))
    .post(coExpress(snippets.create));
  router
    .route('/:snippetId')
    .get(coExpress(snippets.read))
    .patch(coExpress(snippets.patch))
    .delete(coExpress(snippets.deleteSnippet));
  router
    .use(notFound);

  router.param('snippetId', coExpress(snippets.snippetById));
  app.use(`${config.urlInfix}/api/snippets`, router);
};
