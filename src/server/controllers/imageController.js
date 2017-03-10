const dbErrorCheck = require('../utils/dbErrorCheck');
const imageService = require('../services/imageService');

function* list(req, res, next) {
  try {
    const images = yield imageService.listImages();
    res.json(images);
  } catch (err) {
    next(dbErrorCheck(err));
  }
}

function* create(req, res, next) {
  try {
    const { file, body: { name } } = req;
    if (!file || !name) {
      res
        .status(403)
        .json({ message: 'expect 1 file upload named image and name' });
      return;
    }
    const fileType = /^image\/(jpe?g|png|gif)$/i.exec(file.mimetype);
    if (!fileType) {
      res
        .status(403)
        .json({ message: 'expect image file' });
      return;
    }

    const image = yield imageService.createImage(file, name, fileType[1]);
    res.status(201).json(image);
  } catch (err) {
    next(dbErrorCheck(err));
  }
}

module.exports = {
  list,
  create
};
