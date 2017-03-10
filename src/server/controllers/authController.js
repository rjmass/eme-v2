const handleError = require('../utils/handleError');
const userService = require('../services/userService');

exports.logout = function logout(req, res) {
  res.cookie('s3o_token', '', { maxAge: -1, httpOnly: true });
  return res.json({ message: 'OK' });
};

exports.loadAuth = function* loadAuth(req, res, next) {
  const failed = () => next(handleError('Not Authenticated', 401));
  const username = req.cookies.s3o_username;

  if (!username) {
    return failed();
  }

  const user = yield userService.fetchUserByUsername(username);

  if (!user) {
    return failed();
  }

  req.user = user;
  return res.json(req.user);
};
