const handleError = require('../utils/handleError');

function isAdmin(req) {
  const { user } = req;
  return user.admin;
}

function isUser(req) {
  const { user: reqUser } = req;
  const { userById } = req;
  return (reqUser._id.toString() === userById._id.toString());
}

function authorizeUserManagement(req, res, next) {
  return isAdmin(req) ?
    next() :
    next(handleError('Not Authorized', 403));
}

function authorizeAccountManagement(req, res, next) {
  return isAdmin(req) || isUser(req) ?
    next() :
    next(handleError('Not Authorized', 403));
}

module.exports = {
  authorizeUserManagement,
  authorizeAccountManagement
};
