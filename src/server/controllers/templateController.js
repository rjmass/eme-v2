const url = require('url');
const qs = require('querystring');
const templateService = require('../services/templateService');
const handleError = require('../utils/handleError');

function* list(req, res, next) {
  const parsedQuery = url.parse(req.originalUrl, true).query;
  const query = qs.stringify(Object.assign({}, parsedQuery, { type: 'EME' }));

  try {
    const templates = yield templateService.fetchTemplates(query, res);
    res.json(templates);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* read(req, res, next) {
  const templateId = req.params.templateId;
  try {
    const template = yield templateService.fetchTemplate(templateId);
    res.json(template);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* create(req, res, next) {
  const body = Object.assign({}, req.body, { type: 'EME' });
  try {
    const template = yield templateService.createTemplate(body);
    res.json(template);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* patch(req, res, next) {
  const templateId = req.params.templateId;
  const body = Object.assign({}, req.body, { type: 'EME' });
  try {
    const template = yield templateService.patchTemplate(templateId, body);
    res.json(template);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* deleteTemplate(req, res, next) {
  const templateId = req.params.templateId;
  try {
    const template = yield templateService.deleteTemplate(templateId);
    res.json(template);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

module.exports = {
  list,
  read,
  create,
  patch,
  deleteTemplate
};
