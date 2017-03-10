const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name cannot be blank'
  }
});

imageSchema.statics.list = function (options = {}) {
  return this.find(options, { __v: 0 });
};


imageSchema.statics.findByS3Ids = function (s3Ids = []) {
  const ids = s3Ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
  return this
    .find({ _id: { $in: ids } })
    .sort({ _id: -1 });
};

mongoose.model('Image', imageSchema);
