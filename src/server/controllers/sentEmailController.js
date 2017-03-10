const url = require('url');
const sentEmailService = require('../services/sentEmailService');
const handleError = require('../utils/handleError');

function* list(req, res, next) {
  const query = url.parse(req.originalUrl).query;
  try {
    const emails = yield sentEmailService.fetchEmails(query, res);
    res.json(emails);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* read(req, res, next) {
  const query = url.parse(req.originalUrl).query;
  const sentEmailId = req.params.sentEmailId;
  try {
    const email = yield sentEmailService.fetchEmail(sentEmailId, query);
    res.json(email);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* deleteSentEmail(req, res, next) {
  const sentEmailId = req.params.sentEmailId;
  try {
    const email = yield sentEmailService.deleteEmail(sentEmailId);
    res.json(email);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

module.exports = {
  list,
  read,
  deleteSentEmail
};
