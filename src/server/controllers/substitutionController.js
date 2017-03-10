const url = require('url');
const substitutionService = require('../services/substitutionService');
const handleError = require('../utils/handleError');

function* list(req, res, next) {
  const query = url.parse(req.originalUrl).query;
  try {
    const substitutions = yield substitutionService.fetchSubstitutions(query, res);
    res.json(substitutions);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* read(req, res, next) {
  const substitutionId = req.params.substitutionId;
  try {
    const substitution = yield substitutionService.fetchSubstitution(substitutionId);
    res.json(substitution);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* readData(req, res, next) {
  const substitutionId = req.params.substitutionId;
  try {
    const substitution = yield substitutionService.fetchSubstitutionData(substitutionId);
    res.type('application/json');
    if (substitution.body) {
      substitution.body.pipe(res);
    } else {
      res.json({});
    }
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* create(req, res, next) {
  try {
    const substitution = yield substitutionService.createSubstitution(req.body);
    res.json(substitution);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* patch(req, res, next) {
  const substitutionId = req.params.substitutionId;
  try {
    const substitution = yield substitutionService.patchSubstitution(substitutionId, req.body);
    res.json(substitution);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* deleteSubstitution(req, res, next) {
  const substitutionId = req.params.substitutionId;
  try {
    const substitution = yield substitutionService.deleteSubstitution(substitutionId);
    res.json(substitution);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

module.exports = {
  list,
  read,
  readData,
  create,
  patch,
  deleteSubstitution
};
