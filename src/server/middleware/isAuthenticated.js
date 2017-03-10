const handleError = require('../utils/handleError');
const userService = require('../services/userService');
const logger = require('../logger');

module.exports = function* isAuthenticated(req, res, next) {
  const username = req.cookies.s3o_username;
  let user;

  if (username) {
    user = yield userService.fetchUserByUsername(username);
  }

  if (user && user.active) {
    req.user = user;
    logger.log(`${user.name} [${user.username}] - ${req.method}${req.originalUrl}`);
    return next();
  }
  return next(handleError('Not Authenticated', 401));
};
