const AWS = require('aws-sdk');
const zlib = require('zlib');
const config = require('../../config');

const accessKeyId = config.awsAccessKeyId;
const secretAccessKey = config.awsSecretAccessKey;

AWS.config.update({
  accessKeyId,
  secretAccessKey
});


const S3 = new AWS.S3({
  params: {
    Bucket: config.awsSubstitutionBucket
  }
});

const getSubstitution = (key) => {
  return new Promise((resolve, reject) => {
    S3.getObject({
      Key: key
    }).send((error, result) => {
      if (error) {
        return reject(error);
      }
      return zlib.gunzip(result.Body, (err, unzipped) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(unzipped.toString()));
      });
    });
  });
};

module.exports = {
  getSubstitution
};
