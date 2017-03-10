const coExpress = require('co-express');
const express = require('express');
const send = require('../controllers/sendController');
const { notFound } = require('../middleware/errors');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();
const config = require('../../config');

module.exports = (app) => {
  router
    .use(coExpress(isAuthenticated))
    .route('/by-address')
    .post(coExpress(send.sendByAddress));
  router
    .route('/by-list')
    .post(coExpress(send.sendByList));
  router
    .use(notFound);

  app.use(`${config.urlInfix}/api/send`, router);
};
