const coExpress = require('co-express');
const express = require('express');
const email = require('../controllers/emailController');
const sentEmail = require('../controllers/sentEmailController');
const scheduledEmail = require('../controllers/scheduledEmailsController');
const { notFound } = require('../middleware/errors');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();
const config = require('../../config');

module.exports = (app) => {
  router
    .use(coExpress(isAuthenticated))
    .route('/sent/:sentEmailId')
    .get(coExpress(sentEmail.read))
    .delete(coExpress(sentEmail.deleteSentEmail));
  router
    .route('/sent')
    .get(coExpress(sentEmail.list));
  router
    .route('/scheduled/:scheduledEmailId')
    .delete(coExpress(scheduledEmail.deleteScheduledEmail));
  router
    .route('/scheduled')
    .get(coExpress(scheduledEmail.list));
  router
    .route('/')
    .get(coExpress(email.list))
    .post(coExpress(email.create));
  router
    .route('/:emailId')
    .get(coExpress(email.read))
    .patch(coExpress(email.patch))
    .delete(coExpress(email.deleteEmail))
    .put(coExpress(email.reimportEmailTemplate));
  router
    .use(notFound);

  app.use(`${config.urlInfix}/api/emails`, router);
};
