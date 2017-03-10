const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const querySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name cannot be blank'
  },
  query: {
    type: String,
    trim: true
  }
});

querySchema.statics.list = function (options = {}) {
  return this.find(options, { __v: 0 });
};

mongoose.model('Query', querySchema);
