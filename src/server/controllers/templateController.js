const url = require('url');
const templateService = require('../services/templateService');
const handleError = require('../utils/handleError');

function* list(req, res, next) {
  const query = url.parse(req.originalUrl).query;
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
  try {
    const template = yield templateService.createTemplate(req.body);
    res.json(template);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* patch(req, res, next) {
  const templateId = req.params.templateId;
  try {
    const template = yield templateService.patchTemplate(templateId, req.body);
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
