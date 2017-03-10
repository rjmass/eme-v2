const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// eslint-disable-next-line
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    match: emailRegex,
    index: { unique: true },
    required: 'Username is required'
  },
  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
  admin: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  preferences: {
    type: {},
    default: {
      confirmEmailSave: true
    }
  }
}, { minimize: false });

userSchema.statics.list = function (options = {}) {
  return this.find(options, { __v: 0 }).lean();
};

mongoose.model('User', userSchema);
