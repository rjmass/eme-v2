const crypto = require('crypto');
const config = require('../../config');

const algorithm = 'aes-256-ctr';
const password = config.emailSigningKey;

exports.decryptEmails = email => {
  const decipher = crypto.createDecipher(algorithm, password);
  let dec = decipher.update(email, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};
