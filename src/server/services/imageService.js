const AWS = require('aws-sdk');
const config = require('../../config');

const mongoose = require('mongoose');
const Image = mongoose.model('Image');
const fs = require('fs');

const accessKeyId = config.awsAccessKeyId;
const secretAccessKey = config.awsSecretAccessKey;

AWS.config.update({
  accessKeyId,
  secretAccessKey
});


const S3 = new AWS.S3({
  params: {
    Bucket: config.awsBucket,
    Prefix: 'images/'
  }
});

const url = (image) => {
  return `https://${config.awsBucket}.s3.amazonaws.com/${image.Key}`;
};

const uploadImage = (file, key) => {
  return new Promise((resolve, reject) => {
    S3.upload({
      Bucket: `${config.awsBucket}/images`,
      ACL: 'public-read',
      Body: fs.createReadStream(file.path),
      Key: key,
      ContentType: file.mimetype,
    }).send((error, image) => {
      if (error) {
        return reject(error);
      }
      return resolve(Object.assign({ url: url(image) }, image));
    });
  });
};

function* createImage(file, name, fileType) {
  const image = yield Image.create({ name });
  const imageS3 = yield uploadImage(file, `${image._id.toString()}.${fileType}`);
  return Object.assign(imageS3, { name });
}

const list = () => {
  const params = {
    Bucket: config.awsConfig,
    Prefix: 'images'
  };
  return new Promise((resolve, reject) => {
    S3.listObjects(params, (error, data) => {
      if (error) {
        return reject(error);
      }
      const images = data
        .Contents
        .map((image) => Object.assign({ url: url(image) }, image));
      return resolve(images);
    });
  });
};

function* listImages() {
  const images = yield list();
  const imageIds = [];
  const imageList = images.map(i => {
    const match = i.Key.match(/^images\/(\w+)\.\w+/);
    if (match) {
      imageIds.push(match[1]);
      i.Key = match[1];
    }
    return i;
  });

  const imagesMetaData = yield Image.findByS3Ids(imageIds);
  return imageList
    .map((image) => {
      const metaData = imagesMetaData.find((imd) => imd._id.toString() === image.Key)
        || { name: false };
      return Object.assign(image, { name: metaData.name });
    })
    .filter(i => i.name);
}

module.exports = {
  createImage,
  listImages,
};
