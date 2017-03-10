const coExpress = require('co-express');
const express = require('express');
const news = require('../controllers/newsController');
const { notFound } = require('../middleware/errors');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();
const config = require('../../config');

module.exports = (app) => {
  router
    .use(coExpress(isAuthenticated))
    .route('/')
    .get(coExpress(news.search));
  router
    .use(notFound);

  app.use(`${config.urlInfix}/api/news`, router);
};
