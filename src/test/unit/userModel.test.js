const testDBUtils = require('../helpers/testDBUtils');
const mongoose = require('mongoose');
const co = require('co');
const sinon = require('sinon');
const expect = require('chai').expect;

const User = mongoose.model('User');
const testUser = require('../fixtures/validUser');

describe('User authentication', () => {
  const sandbox = sinon.sandbox.create();

  before(done => {
    co(function* () {
      yield testDBUtils.connect();
      done();
    }).catch(done);
  });

  beforeEach(done => {
    sandbox.restore();
    co(function* () {
      yield testDBUtils.clearUsers();
      done();
    }).catch(done);
  });

  after(done => {
    sandbox.restore();
    co(function* () {
      yield testDBUtils.clearUsers();
      done();
    }).catch(done);
  });

  it('creates a new user', done => {
    co(function* () {
      const savedUser = yield testDBUtils.createUser(testUser);
      expect(savedUser.username).to.exist;
      expect(savedUser.username).to.eql(testUser.username);
      done();
    }).catch(done);
  });

  it('does not allow duplicate username to exist', done => {
    let duplicateUser = null;
    co(function* () {
      yield User.create(testUser);
      try {
        duplicateUser = yield User.create(testUser);
      } catch (err) {
        expect(err).to.exist;
        expect(duplicateUser).to.not.exist;
        done();
      }
    }).catch(done);
  });
});
