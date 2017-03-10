const newsService = require('../services/newsService');
const handleError = require('../utils/handleError');

function* search(req, res, next) {
  try {
    const news = yield newsService.fetchNews(req.query);
    res.json(news);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

module.exports = {
  search
};
