const co = require('co');
const nock = require('nock');
const expect = require('chai').expect;
const newsService = require('../../server/services/newsService');
const config = require('../../config');

function setNockPost(path) {
  return nock(config.latestNewsHost)
    .post(path);
}

describe('News Content Service', () => {
  beforeEach(nock.cleanAll);
  after(nock.cleanAll);

  describe('retrieves an array of results upon successful search', () => {
    it('returns an array of news', done => {
      setNockPost('/searchResults').reply(200, [{ name: 'item1' }]);
      co(function* () {
        const news = yield newsService.fetchNews();
        expect(news).to.exist;
        done();
      }).catch(done);
    });

    it('returns an empty array if no news', done => {
      setNockPost('/searchResults').reply(200, []);
      co(function* () {
        const news = yield newsService.fetchNews();
        expect(news.length).to.be.empty;
        done();
      }).catch(done);
    });

    it('returns an error if could not fetch news', done => {
      setNockPost('/searchResults').reply(400, { message: 'Bad Request' });
      co(function* () {
        try {
          yield newsService.fetchNews();
        } catch (err) {
          expect(err.message).to.exist;
          expect(err.status).to.eql(400);
          done();
        }
      }).catch(done);
    });
  });
});
