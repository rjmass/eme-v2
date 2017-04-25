const config = require('../../config');
const fetcher = require('./_fetcher')(config.campaignsHost);

function* fetchSnippets(query, res) {
  return yield fetcher.fetchResourceList('/snippets', res, query);
}

function* fetchSnippet(snippetId) {
  return yield fetcher.fetchResourceSingle('/snippets', snippetId);
}

function* createSnippet(snippetBody) {
  return yield fetcher.createResource('/snippets', snippetBody);
}

function* patchSnippet(snippetId, snippetBody) {
  return yield fetcher.patchResource('/snippets', snippetId, snippetBody);
}

function* deleteSnippet(snippetId) {
  return yield fetcher.deleteResource('/snippets', snippetId);
}

module.exports = {
  fetchSnippets,
  fetchSnippet,
  createSnippet,
  patchSnippet,
  deleteSnippet
};
