const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const snippetSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name cannot be blank'
  },
  description: {
    type: String,
    trim: true
  },
  body: {
    type: String,
    trim: true,
    default: '',
  },
  isHtml: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

snippetSchema.statics.list = function (options = {}) {
  return this.find(options, { __v: 0 });
};

mongoose.model('Snippet', snippetSchema);
