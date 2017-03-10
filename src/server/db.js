const mongoose = require('mongoose');
const logger = require('./logger');

require('./models/userModel');
require('./models/snippetModel');
require('./models/queryModel');
require('./models/imageModel');

// Check mongoose docs for changing promise constructor
mongoose.Promise = global.Promise;

module.exports = (config) => {
  const db = mongoose.connection;

  db.once('open', () => {
    logger.info('Database open');
  });

  db.once('connected', () => {
    logger.info('Database connected');
  });

  db.once('reconnected', () => {
    logger.info('Database reconnected');
  });

  db.on('error', err => {
    logger.error(err);
    mongoose.disconnect();
  });

  db.once('disconnected', () => {
    logger.info('Database disconnected');
    mongoose.connect(config.dbURL, { server: { auto_reconnect: true } });
  });

  function connectWithRetry() {
    mongoose.connect(config.dbURL, { server: { auto_reconnect: true } }, (err) => {
      if (err) {
        setTimeout(connectWithRetry, 5000);
      }
    });
  }

  connectWithRetry();

  return db;
};
