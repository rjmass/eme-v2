const map = require('lodash/map');
const userService = require('../services/userService');
const handleError = require('../utils/handleError');

function* userById(req, res, next, _id) {
  try {
    const user = yield userService.fetchUser(_id);
    if (user) {
      req.userById = user.toObject();
      return next();
    }
    return next(handleError('User not found', 404));
  } catch (err) {
    return next(handleError(err.message));
  }
}

function* list(req, res, next) {
  try {
    const users = yield userService.fetchUsers();
    res.json(users);
  } catch (err) {
    next(handleError(err.message));
  }
}

function* read(req, res, next) {
  const userId = req.params.userId;
  try {
    const user = yield userService.fetchUser(userId);
    res.json(user);
  } catch (err) {
    next(handleError(err.message));
  }
}

function* create(req, res, next) {
  try {
    const user = yield userService.createUser(req.body);
    res.json(user);
  } catch (err) {
    next(handleError(err.message, 400, map(err.errors, x => x.message)));
  }
}

function* patch(req, res, next) {
  const { userId } = req.params;
  try {
    const { admin = false } = req.user;
    const user = yield userService.patchUser(userId, req.body, admin);
    res.json(user);
  } catch (err) {
    next(handleError(err.message, 400, map(err.errors, x => x.message)));
  }
}

function* deleteUser(req, res, next) {
  const userId = req.params.userId;
  try {
    const user = yield userService.deleteUser(userId);
    res.json(user);
  } catch (err) {
    next(handleError(err.message));
  }
}

module.exports = {
  userById,
  list,
  read,
  create,
  patch,
  deleteUser
};
