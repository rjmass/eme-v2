const mongoose = require('mongoose');
const handleError = require('../utils/handleError');
const dbErrorCheck = require('../utils/dbErrorCheck');

const Snippet = mongoose.model('Snippet');

function* snippetById(req, res, next, _id) {
  try {
    const snippet = yield Snippet.findOne({ _id });
    if (snippet) {
      req.snippet = snippet;
      return next();
    }
    return next(handleError('Snippet not found', 404));
  } catch (err) {
    return next(dbErrorCheck(err));
  }
}

function* list(req, res, next) {
  try {
    const snippets = yield Snippet.list();
    res.json(snippets);
  } catch (err) {
    next(dbErrorCheck(err));
  }
}

function* read(req, res) {
  res.json(req.snippet);
}

function* create(req, res, next) {
  try {
    const snippet = yield Snippet.create(req.body);
    res.status(201).json(snippet);
  } catch (err) {
    next(dbErrorCheck(err));
  }
}

function* patch(req, res, next) {
  const snippetObj = req.snippet.toObject();
  Object.assign(snippetObj, req.body);
  try {
    const snippet = yield Snippet.findOneAndUpdate({ _id: snippetObj._id },
      snippetObj,
      { runValidators: true, new: true });
    res.json(snippet);
  } catch (err) {
    next(dbErrorCheck(err));
  }
}

function* deleteSnippet(req, res, next) {
  try {
    yield Snippet.findOneAndRemove({ _id: req.snippet._id });
    res.json(req.snippet);
  } catch (err) {
    next(dbErrorCheck(err));
  }
}

module.exports = {
  list,
  read,
  snippetById,
  create,
  patch,
  deleteSnippet
};
