const co = require('co');
const nock = require('nock');
const expect = require('chai').expect;
const substitutionService = require('../../server/services/substitutionService');
const config = require('../../config');

const validSubstitution = require('../fixtures/validSubstitution');

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

describe('Substitution Service', () => {
  const substitutionId = '123';

  beforeEach(() => {
    nock.cleanAll();
  });

  after(() => {
    nock.cleanAll();
  });

  describe('fetchSubstitutions', () => {
    it('returns an array of substitutions', done => {
      setNockGet('/substitutions').reply(200, validSubstitution);
      co(function* () {
        const substitution = yield substitutionService.fetchSubstitutions(null, {});
        expect(substitution.name).to.eql(validSubstitution.name);
        done();
      }).catch(done);
    });

    it('returns an error if substitutions cannot be listed', done => {
      setNockGet('/substitutions').reply(500, {});
      co(function* () {
        try {
          yield substitutionService.fetchSubstitutions(null, {});
        } catch (err) {
          expect(err).to.exist;
          expect(err.status).to.eql(500);
          done();
        }
      }).catch(done);
    });
  });

  describe('fetchSubstitution', () => {
    it('returns a single substitution by id', done => {
      setNockGet(`/substitutions/${substitutionId}`).reply(200, validSubstitution);
      co(function* () {
        const substitution = yield substitutionService.fetchSubstitution(substitutionId);
        expect(substitution.name).to.eql(validSubstitution.name);
        done();
      }).catch(done);
    });

    it('returns an error if invalid id is provided', done => {
      const invalidId = 'invalidId';
      setNockGet(`/substitutions/${invalidId}`).reply(400, { message: 'Bad Request' });
      co(function* () {
        try {
          yield substitutionService.fetchSubstitution(invalidId);
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(400);
          done();
        }
      }).catch(done);
    });

    it('returns an error if substitution not found', done => {
      const notFoundId = 'notFound';
      setNockGet(`/substitutions/${notFoundId}`).reply(404, { message: 'Not Found' });
      co(function* () {
        try {
          yield substitutionService.fetchSubstitution(notFoundId);
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(404);
          done();
        }
      }).catch(done);
    });
  });

  describe('createSubstitution', () => {
    it('returns the created substitution if successful', done => {
      setNockPost('/substitutions').reply(201, validSubstitution);
      co(function* () {
        const substitution = yield substitutionService.createSubstitution(validSubstitution);
        expect(substitution.name).to.eql(validSubstitution.name);
        done();
      }).catch(done);
    });

    it('returns an error if could not create substitution', done => {
      setNockPost('/substitutions').reply(400, { message: 'Bad Request' });
      co(function* () {
        try {
          yield substitutionService.createSubstitution(validSubstitution);
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(400);
          done();
        }
      }).catch(done);
    });
  });

  describe('patchSubstitution', () => {
    it('returns a modified substitution', done => {
      const patchBody = { name: 'newName' };
      setNockPatch(`/substitutions/${substitutionId}`)
        .reply(200, Object.assign({}, validSubstitution, patchBody));

      co(function* () {
        const substitution = yield substitutionService.patchSubstitution(substitutionId, patchBody);
        expect(substitution.name).to.not.eql(validSubstitution.name);
        expect(substitution.name).to.eql(patchBody.name);
        done();
      }).catch(done);
    });

    it('returns error if db throws error', done => {
      const patchBody = { somethingWrong: 'newName' };
      setNockPatch(`/substitutions/${substitutionId}`).reply(400, { message: 'Bad Request' });
      co(function* () {
        try {
          yield substitutionService.patchSubstitution(substitutionId, patchBody);
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(400);
          done();
        }
      }).catch(done);
    });
  });

  describe('deleteSubstitution', () => {
    it('deletes substitution and returns deleted substitution', done => {
      setNockDelete(`/substitutions/${substitutionId}`).reply(200, validSubstitution);
      co(function* () {
        const substitution = yield substitutionService.deleteSubstitution(substitutionId);
        expect(substitution.name).to.eql(validSubstitution.name);
        done();
      }).catch(done);
    });

    it('returns error if db throws error', done => {
      setNockDelete(`/substitutions/${substitutionId}`).reply(500, { message: 'DB Error' });
      co(function* () {
        try {
          yield substitutionService.deleteSubstitution(substitutionId);
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(500);
          done();
        }
      }).catch(done);
    });
  });
});
