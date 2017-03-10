const co = require('co');
const nock = require('nock');
const expect = require('chai').expect;
const templateService = require('../../server/services/templateService');
const config = require('../../config');

const validTemplate = require('../fixtures/template');

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

describe('Template Service', () => {
  const templateId = '123';

  beforeEach(() => {
    nock.cleanAll();
  });

  after(() => {
    nock.cleanAll();
  });

  describe('fetchTemplates', () => {
    it('returns an array of templates', done => {
      setNockGet('/templates').reply(200, validTemplate);
      co(function* () {
        const template = yield templateService.fetchTemplates(null, {});
        expect(template.name).to.eql(validTemplate.name);
        done();
      }).catch(done);
    });

    it('returns an error if templates cannot be listed', done => {
      setNockGet('/templates').reply(500, {});
      co(function* () {
        try {
          yield templateService.fetchTemplates(null, {});
        } catch (err) {
          expect(err).to.exist;
          expect(err.status).to.eql(500);
          done();
        }
      }).catch(done);
    });
  });

  describe('fetchTemplate', () => {
    it('returns a single template by id', done => {
      setNockGet(`/templates/${templateId}`).reply(200, validTemplate);
      co(function* () {
        const template = yield templateService.fetchTemplate(templateId);
        expect(template.name).to.eql(validTemplate.name);
        done();
      }).catch(done);
    });

    it('returns an error if invalid id is provided', done => {
      const invalidId = 'invalidId';
      setNockGet(`/templates/${invalidId}`).reply(400, { message: 'Bad Request' });
      co(function* () {
        try {
          yield templateService.fetchTemplate(invalidId);
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(400);
          done();
        }
      }).catch(done);
    });

    it('returns an error if template not found', done => {
      const notFoundId = 'notFound';
      setNockGet(`/templates/${notFoundId}`).reply(404, { message: 'Not Found' });
      co(function* () {
        try {
          yield templateService.fetchTemplate(notFoundId);
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(404);
          done();
        }
      }).catch(done);
    });
  });

  describe('createTemplate', () => {
    it('returns the created template if successful', done => {
      setNockPost('/templates').reply(201, validTemplate);
      co(function* () {
        const template = yield templateService.createTemplate(validTemplate);
        expect(template.name).to.eql(validTemplate.name);
        done();
      }).catch(done);
    });

    it('returns an error if service throws error', done => {
      setNockPost('/templates').reply(400, { message: 'Bad Request' });
      co(function* () {
        try {
          yield templateService.createTemplate(validTemplate);
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(400);
          done();
        }
      }).catch(done);
    });
  });

  describe('patchTemplate', () => {
    it('returns a modified template', done => {
      const patchBody = { name: 'newName' };
      setNockPatch(`/templates/${templateId}`)
        .reply(200, Object.assign({}, validTemplate, patchBody));

      co(function* () {
        const template = yield templateService.patchTemplate(templateId, patchBody);
        expect(template.name).to.not.eql(validTemplate.name);
        expect(template.name).to.eql(patchBody.name);
        done();
      }).catch(done);
    });

    it('returns error if db throws error', done => {
      const patchBody = { somethingWrong: 'newName' };
      setNockPatch(`/templates/${templateId}`).reply(400, { message: 'Bad Request' });
      co(function* () {
        try {
          yield templateService.patchTemplate(templateId, patchBody);
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(400);
          done();
        }
      }).catch(done);
    });
  });

  describe('deleteTemplate', () => {
    it('deletes template and returns deleted template', done => {
      setNockDelete(`/templates/${templateId}`).reply(200, validTemplate);
      co(function* () {
        const template = yield templateService.deleteTemplate(templateId);
        expect(template.name).to.eql(validTemplate.name);
        done();
      }).catch(done);
    });

    it('returns error if db throws error', done => {
      setNockDelete(`/templates/${templateId}`).reply(500, { message: 'DB Error' });
      co(function* () {
        try {
          yield templateService.deleteTemplate(templateId);
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(500);
          done();
        }
      }).catch(done);
    });
  });
});
