const co = require('co');
const nock = require('nock');
const expect = require('chai').expect;
const emailService = require('../../server/services/emailService');
const config = require('../../config');

const validEmail = require('../fixtures/validEmail');

function setNockGet(path) {
  return nock(config.campaignsHost)
    .get(path);
}

function setNockPost(path) {
  return nock(config.campaignsHost)
    .post(path);
}

function setNockPatch(path) {
  return nock(config.campaignsHost)
    .patch(path);
}

function setNockDelete(path) {
  return nock(config.campaignsHost)
    .delete(path);
}

describe('Email Service', () => {
  const emailId = '123';

  beforeEach(() => {
    nock.cleanAll();
  });

  after(() => {
    nock.cleanAll();
  });

  describe('fetchEmails', () => {
    it('returns an array of emails', done => {
      setNockGet('/emails').reply(200, validEmail);
      co(function* () {
        const email = yield emailService.fetchEmails({});
        expect(email.name).to.eql(validEmail.name);
        done();
      }).catch(done);
    });

    it('returns an error if emails cannot be listed', done => {
      setNockGet('/emails').reply(500, {});
      co(function* () {
        try {
          yield emailService.fetchEmails({});
        } catch (err) {
          expect(err).to.exist;
          expect(err.status).to.eql(500);
          done();
        }
      }).catch(done);
    });
  });

  describe('fetchEmail', () => {
    it('returns a single email by id', done => {
      setNockGet(`/emails/${emailId}`).reply(200, validEmail);
      co(function* () {
        const email = yield emailService.fetchEmail(emailId);
        expect(email.name).to.eql(validEmail.name);
        done();
      }).catch(done);
    });

    it('returns an error if invalid id is provided', done => {
      const invalidId = 'invalidId';
      setNockGet(`/emails/${invalidId}`).reply(400, { message: 'Bad Request' });
      co(function* () {
        try {
          yield emailService.fetchEmail(invalidId);
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(400);
          done();
        }
      }).catch(done);
    });

    it('returns an error if email not found', done => {
      const notFoundId = 'notFound';
      setNockGet(`/emails/${notFoundId}`).reply(404, { message: 'Not Found' });
      co(function* () {
        try {
          yield emailService.fetchEmail(notFoundId);
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(404);
          done();
        }
      }).catch(done);
    });
  });

  describe('createEmail', () => {
    it('returns the created email if successful', done => {
      setNockPost('/emails').reply(201, validEmail);
      co(function* () {
        const email = yield emailService.createEmail(validEmail);
        expect(email.name).to.eql(validEmail.name);
        done();
      }).catch(done);
    });

    it('returns an error if service throws error', done => {
      setNockPost('/emails').reply(400, { message: 'Bad Request' });
      co(function* () {
        try {
          yield emailService.createEmail(validEmail);
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(400);
          done();
        }
      }).catch(done);
    });
  });

  describe('patchEmail', () => {
    it('returns a modified email', done => {
      const patchBody = { name: 'newName' };
      setNockPatch(`/emails/${emailId}`).reply(200, Object.assign({}, validEmail, patchBody));
      co(function* () {
        const email = yield emailService.patchEmail(emailId, patchBody);
        expect(email.name).to.not.eql(validEmail.name);
        expect(email.name).to.eql(patchBody.name);
        done();
      }).catch(done);
    });

    it('returns error if db throws error', done => {
      const patchBody = { somethingWrong: 'newName' };
      setNockPatch(`/emails/${emailId}`).reply(400, { message: 'Bad Request' });
      co(function* () {
        try {
          yield emailService.patchEmail(emailId, patchBody);
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(400);
          done();
        }
      }).catch(done);
    });
  });

  describe('deleteEmail', () => {
    it('deletes email and returns deleted email', done => {
      setNockDelete(`/emails/${emailId}`).reply(200, validEmail);
      co(function* () {
        const email = yield emailService.deleteEmail(emailId);
        expect(email.name).to.eql(validEmail.name);
        done();
      }).catch(done);
    });

    it('returns error if db throws error', done => {
      setNockDelete(`/emails/${emailId}`).reply(500, { message: 'DB Error' });
      co(function* () {
        try {
          yield emailService.deleteEmail(emailId);
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(500);
          done();
        }
      }).catch(done);
    });
  });
});
