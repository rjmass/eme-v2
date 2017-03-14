const url = require('url');
const qs = require('querystring');
const snippetService = require('../services/snippetService');
const handleError = require('../utils/handleError');

function* list(req, res, next) {
  const parsedQuery = url.parse(req.originalUrl, true).query;
  const query = qs.stringify(Object.assign({}, parsedQuery, { type: 'EME' }));

  try {
    const snippets = yield snippetService.fetchSnippets(query, res);
    res.json(snippets);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* read(req, res, next) {
  const snippetId = req.params.snippetId;
  try {
    const snippet = yield snippetService.fetchSnippet(snippetId);
    res.json(snippet);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* create(req, res, next) {
  const body = Object.assign({}, req.body, { type: 'EME' });
  try {
    const snippet = yield snippetService.createSnippet(body);
    res.json(snippet);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* patch(req, res, next) {
  const snippetId = req.params.snippetId;
  const body = Object.assign({}, req.body, { type: 'EME' });
  try {
    const snippet = yield snippetService.patchSnippet(snippetId, body);
    res.json(snippet);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* deleteSnippet(req, res, next) {
  const snippetId = req.params.snippetId;
  try {
    const snippet = yield snippetService.deleteSnippet(snippetId);
    res.json(snippet);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

module.exports = {
  list,
  read,
  create,
  patch,
  deleteSnippet
};
