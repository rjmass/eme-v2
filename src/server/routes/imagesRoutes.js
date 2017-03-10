const coExpress = require('co-express');
const express = require('express');
const images = require('../controllers/imageController');
const { notFound } = require('../middleware/errors');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();
const multer = require('multer');
const config = require('../../config');

const upload = multer({ dest: 'uploads/' });

module.exports = (app) => {
  router
    .use(coExpress(isAuthenticated))
    .route('/')
    .get(coExpress(images.list))
    .post(upload.single('image'), coExpress(images.create));
  router
    .use(notFound);

  app.use(`${config.urlInfix}/api/images`, router);
};
