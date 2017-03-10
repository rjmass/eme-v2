const mongoose = require('mongoose');
const handleError = require('../utils/handleError');
const dbErrorCheck = require('../utils/dbErrorCheck');

const Query = mongoose.model('Query');

function* queryById(req, res, next, _id) {
  try {
    const query = yield Query.findOne({ _id });
    if (query) {
      req.query = query;
      return next();
    }
    return next(handleError('Query not found', 404));
  } catch (err) {
    return next(dbErrorCheck(err));
  }
}

function* list(req, res, next) {
  try {
    const querys = yield Query.list();
    res.json(querys);
  } catch (err) {
    next(dbErrorCheck(err));
  }
}

function* read(req, res) {
  res.json(req.query);
}

function* create(req, res, next) {
  try {
    const query = yield Query.create(req.body);
    res.status(201).json(query);
  } catch (err) {
    next(dbErrorCheck(err));
  }
}

function* patch(req, res, next) {
  const queryObj = req.query.toObject();
  Object.assign(queryObj, req.body);
  try {
    const query = yield Query.findOneAndUpdate({ _id: queryObj._id },
      queryObj,
      { runValidators: true, new: true });
    res.json(query);
  } catch (err) {
    next(dbErrorCheck(err));
  }
}

function* deleteQuery(req, res, next) {
  try {
    yield Query.findOneAndRemove({ _id: req.query._id });
    res.json(req.query);
  } catch (err) {
    next(dbErrorCheck(err));
  }
}

module.exports = {
  list,
  read,
  queryById,
  create,
  patch,
  deleteQuery
};
