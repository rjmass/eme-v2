const fetch = require('node-fetch');
const handleError = require('../utils/handleError');
const config = require('../../config');
const logger = require('../logger');

function generateOptions(body, auth = {}) {
  return {
    method: 'POST',
    headers: Object.assign({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }, auth),
    body: JSON.stringify(body)
  };
}
function* sendByList(body) {
  const sendBody = {
    key: body.recipients.list_id,
    emailId: body.id,
    options: {
      start_time: body.startTime
    },
    metadata: {
      parentEmailName: body.name,
      campaignId: body.campaignId
    }
  };

  const auth = { 'x-api-key': config.listSendAuth };
  const response = yield fetch(config.listSendHost, generateOptions(sendBody, auth));
  let json;
  try {
    json = yield response.json();
  } catch (err) {
    logger.log(response, err);
    throw handleError('Possible failure. Please confirm before trying again',
      response.status);
  }

  if (response.status >= 300) {
    const [error = {}] = json.errors;
    throw handleError(error.message, response.status);
  }
  return json;
}

function* sendByAddress(body, query = '') {
  const url = `${config.espInterceptorHost}/transmissions${query}`;
  const sendBody = {
    name: body.id, // This will allow us to filter by parentId when retrieving scheduled emails
    options: {
      start_time: body.startTime
    },
    metadata: {
      parentEmailName: body.name,
      campaignId: body.campaignId
    },
    substitutionId: body.substitutionId,
    recipients: body.recipients,
    content: {
      template_id: body.id,
    }
  };

  const auth = new Buffer(`${config.espInterceptorUsername}:${config.espInterceptorPassword}`);
  const basicAuth = `Basic ${auth.toString('base64')}`;

  const response = yield fetch(url, generateOptions(sendBody, { Authorization: basicAuth }));
  let json;
  try {
    json = yield response.json();
  } catch (err) {
    logger.log(response, err);
    throw handleError('Possible failure. Please confirm before trying again',
      response.status);
  }

  if (response.status >= 300) {
    const [error = {}] = json.errors;
    throw handleError(error.message, response.status);
  }
  return json;
}

module.exports = {
  sendByAddress,
  sendByList
};
