const url = require('url');
const qs = require('querystring');
const emailService = require('../services/emailService');
const handleError = require('../utils/handleError');

function* list(req, res, next) {
  const parsedQuery = url.parse(req.originalUrl, true).query;
  const query = qs.stringify(Object.assign({}, parsedQuery, { type: 'EME' }));

  try {
    const emails = yield emailService.fetchEmails(query, res);
    res.json(emails);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* read(req, res, next) {
  const parsedQuery = url.parse(req.originalUrl, true).query;
  const query = qs.stringify(Object.assign({}, parsedQuery, { type: 'EME' }));
  const emailId = req.params.emailId;

  try {
    const email = yield emailService.fetchEmail(emailId, query);
    res.json(email);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* create(req, res, next) {
  try {
    const email = yield emailService.createEmail(req.body);
    res.json(email);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* patch(req, res, next) {
  const emailId = req.params.emailId;
  try {
    const email = yield emailService.patchEmail(emailId, req.body);
    res.json(email);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* deleteEmail(req, res, next) {
  const emailId = req.params.emailId;
  try {
    const email = yield emailService.deleteEmail(emailId);
    res.json(email);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* reimportEmailTemplate(req, res, next) {
  const emailId = req.params.emailId;
  try {
    const email = yield emailService.reimportEmailTemplate(emailId);
    res.json(email);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

module.exports = {
  list,
  read,
  create,
  patch,
  deleteEmail,
  reimportEmailTemplate
};
