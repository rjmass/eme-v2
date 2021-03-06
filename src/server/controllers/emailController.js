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
  const body = Object.assign({}, req.body, { type: 'EME' });
  try {
    const email = yield emailService.createEmail(body);
    res.json(email);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* patch(req, res, next) {
  const emailId = req.params.emailId;
  const body = Object.assign({}, req.body, { type: 'EME' });
  try {
    const email = yield emailService.patchEmail(emailId, body, req.user.username);
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

function* readEmailLock(req, res, next) {
  const emailId = req.params.emailId;
  try {
    const lock = yield emailService.fetchEmailLock(emailId);
    res.json(lock);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* createEmailLock(req, res, next) {
  const emailId = req.body.emailId;
  try {
    const lock = yield emailService.createEmailLock(emailId, req.user.username);
    res.json(lock);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* deleteEmailLock(req, res, next) {
  const emailId = req.params.emailId;
  try {
    const lock = yield emailService.fetchEmailLock(emailId);
    if (!lock) {
      return next(handleError('Lock not found', 404));
    }
    // let admin turn off locks for others
    const username = req.user.admin ? lock.username : req.user.username;

    yield emailService.deleteEmailLock(emailId, username);
    return res.status(204).json();
  } catch (err) {
    return next(handleError(err.message, err.status));
  }
}

module.exports = {
  list,
  read,
  create,
  patch,
  deleteEmail,
  reimportEmailTemplate,
  readEmailLock,
  createEmailLock,
  deleteEmailLock
};
