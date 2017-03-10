const app = require('../../server/server');
const superagent = require('supertest');

exports.agent = function agent() {
  return superagent.agent(app);
};

