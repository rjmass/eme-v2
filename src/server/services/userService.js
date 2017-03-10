const mongoose = require('mongoose');
const User = mongoose.model('User');
const omit = require('lodash/omit');

function* fetchUsers() {
  return yield User.list();
}

function* fetchUser(_id) {
  return yield User.findOne({ _id });
}

function* fetchUserByUsername(username) {
  const user = yield User.findOne({ username: `${username}@ft.com` });
  return user ? user.toObject() : null;
}

function* createUser(userBody) {
  return yield User.create(userBody);
}

/**
 * Admin mode allows to change fields
 * that are otherwise restricted
 */
function* patchUser(_id, userBody, adminMode = false) {
  const user = yield fetchUser(_id);
  const omitFields = adminMode ? [] : ['username'];
  const newUser = Object.assign({}, user.toObject(), omit(userBody, omitFields));
  return yield User.findOneAndUpdate({ _id }, newUser, { runValidators: true, new: true });
}

function* deleteUser(_id) {
  return yield User.findOneAndRemove({ _id });
}

module.exports = {
  fetchUsers,
  fetchUser,
  fetchUserByUsername,
  createUser,
  patchUser,
  deleteUser
};
