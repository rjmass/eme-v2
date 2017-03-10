const mongoose = require('mongoose');
const config = require('../../config');
const db = require('../../server/db');

let User;

function clearCollection(collection) {
  return new Promise((resolve, reject) => {
    mongoose.connection.collections[collection].remove((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function createDoc(model, createObj) {
  return new Promise((resolve, reject) => {
    model.create(createObj, (err, doc) => {
      if (err) {
        return reject(err);
      }
      return resolve(doc);
    });
  });
}

exports.clearUsers = function clearUsers() {
  return clearCollection('users');
};

exports.createUser = function createUser(user) {
  return createDoc(mongoose.model('User'), user);
};

exports.connect = function connect() {
  return new Promise((resolve, reject) => {
    const dbConnection = db(config);
    dbConnection.on('open', () => {
      resolve();
    });
  });
};
