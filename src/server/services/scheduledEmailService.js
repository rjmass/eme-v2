const fetch = require('node-fetch');
const handleError = require('../utils/handleError');
const config = require('../../config');

const auth = new Buffer(`${config.espInterceptorUsername}:${config.espInterceptorPassword}`);
const basicAuth = `Basic ${auth.toString('base64')}`;

function generateOptions(method) {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: basicAuth
    }
  };
}

function* fetchEmails(query = '') {
  const url = `${config.espInterceptorHost}/transmissions${query}`;
  const response = yield fetch(url, generateOptions('GET'));
  const json = yield response.json();
  if (response.status >= 300) {
    const [error = {}] = json.errors;
    throw handleError(error.message, response.status);
  }
  return json;
}


function* deleteEmail(scheduledEmaillId) {
  const url = `${config.espInterceptorHost}/transmissions/${scheduledEmaillId}`;
  const response = yield fetch(url, generateOptions('DELETE'));
  const json = yield response.json();
  if (response.status >= 300) {
    const [error = {}] = json.errors;
    throw handleError(error.message, response.status);
  }
  return json;
}


function* fetchEmail(scheduledEmaillId) {
  const url = `${config.espInterceptorHost}/transmissions/${scheduledEmaillId}`;
  const response = yield fetch(url, generateOptions('GET'));
  const json = yield response.json();
  if (response.status >= 300) {
    const [error = {}] = json.errors;
    throw handleError(error.message, response.status);
  }
  return json;
}

module.exports = {
  fetchEmails,
  deleteEmail,
  fetchEmail
};
