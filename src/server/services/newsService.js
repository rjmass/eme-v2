const config = require('../../config');
const fetcher = require('./_fetcher')(config.latestNewsHost);

function* fetchNews(query) {
  return yield fetcher.createResource('/searchResults', query);
}

module.exports = {
  fetchNews
};
