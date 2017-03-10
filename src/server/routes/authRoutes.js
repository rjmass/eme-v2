const coExpress = require('co-express');
const express = require('express');
const { logout, loadAuth } = require('../controllers/authController');
const { notFound } = require('../middleware/errors');
const router = express.Router();
const config = require('../../config');

module.exports = (app) => {
  router
    .route('/logout')
    .post(coExpress(logout));
  router
    .route('/loadauth')
    .get(coExpress(loadAuth));
  router
    .use(notFound);

  app.use(`${config.urlInfix}/api`, router);
};
