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

function* patchEmail(emailId, emailBody, username) {
  return yield fetcher.patchResource('/emails', emailId, emailBody, { 'X-USER': username });
}

function* deleteEmail(emailId) {
  return yield fetcher.deleteResource('/emails', emailId);
}

function* reimportEmailTemplate(emailId) {
  return yield fetcher.putResource('/emails', emailId);
}

function* fetchEmailLock(emailId) {
  return yield fetcher.fetchResourceSingle('/emails/lock', emailId);
}

function* createEmailLock(emailId, username) {
  return yield fetcher.createResource('/emails/lock', { emailId, username });
}

module.exports = {
  fetchEmails,
  fetchEmail,
  createEmail,
  reimportEmailTemplate,
  patchEmail,
  deleteEmail,
  fetchEmailLock,
  createEmailLock
};
