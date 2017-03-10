const url = require('url');
const sendService = require('../services/sendService');
const handleError = require('../utils/handleError');

function* sendByAddress(req, res, next) {
  const query = url.parse(req.originalUrl).search || '';
  try {
    const success = yield sendService.sendByAddress(req.body, query);
    res.json(success);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* sendByList(req, res, next) {
  try {
    const success = yield sendService.sendByList(req.body);
    res.json(success);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

module.exports = {
  sendByAddress,
  sendByList
};
