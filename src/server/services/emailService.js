const config = require('../../config');
const fetcher = require('./_fetcher')(config.campaignsHost);

function* fetchEmails(query, res) {
  return yield fetcher.fetchResourceList('/emails', res, query);
}

function* fetchEmail(emailId, query) {
  return yield fetcher.fetchResourceSingle('/emails', emailId, query);
}

function* createEmail(emailBody) {
  return yield fetcher.createResource('/emails', emailBody);
}

function* patchEmail(emailId, emailBody) {
  return yield fetcher.patchResource('/emails', emailId, emailBody);
}

function* deleteEmail(emailId) {
  return yield fetcher.deleteResource('/emails', emailId);
}

function* reimportEmailTemplate(emailId) {
  return yield fetcher.putResource('/emails', emailId);
}

module.exports = {
  fetchEmails,
  fetchEmail,
  createEmail,
  reimportEmailTemplate,
  patchEmail,
  deleteEmail
};
