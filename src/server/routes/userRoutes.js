const express = require('express');
const config = require('../../config');
const coExpress = require('co-express');
const users = require('../controllers/userController');
const { notFound } = require('../middleware/errors');
const isAuthenticated = require('../middleware/isAuthenticated');
const { authorizeUserManagement, authorizeAccountManagement }
  = require('../middleware/authorizeUserManagement');
const router = express.Router();

module.exports = (app) => {
  router
    .use(coExpress(isAuthenticated))
    .route('/')
    .get(authorizeUserManagement, coExpress(users.list))
    .post(authorizeUserManagement, coExpress(users.create));

  router
    .route('/:userId')
    .get(authorizeAccountManagement, coExpress(users.read))
    .patch(authorizeAccountManagement, coExpress(users.patch))
    .delete(authorizeAccountManagement, coExpress(users.deleteUser));

  router
    .use(notFound);

  router
    .param('userId', coExpress(users.userById));

  app.use(`${config.urlInfix}/api/users`, router);
};
