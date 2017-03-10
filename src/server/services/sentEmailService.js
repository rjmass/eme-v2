const config = require('../../config');
const fetcher = require('./_fetcher')(config.campaignsHost);

function* fetchEmails(query, res) {
  return yield fetcher.fetchResourceList('/emails/sent', res, query);
}

function* fetchEmail(emailId, query) {
  return yield fetcher.fetchResourceSingle('/emails/sent', emailId, query);
}

function* deleteEmail(emailId) {
  return yield fetcher.deleteResource('/emails/sent', emailId);
}

module.exports = {
  fetchEmails,
  fetchEmail,
  deleteEmail
};
