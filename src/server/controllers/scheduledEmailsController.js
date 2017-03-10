const url = require('url');
const scheduledEmailService = require('../services/scheduledEmailService');
const sentEmailService = require('../services/sentEmailService');
const handleError = require('../utils/handleError');

function* list(req, res, next) {
  const query = url.parse(req.originalUrl).search || '';
  try {
    const emails = yield scheduledEmailService.fetchEmails(query, res);
    res.json(emails);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

function* deleteScheduledEmail(req, res, next) {
  const scheduledEmaillId = req.params.scheduledEmailId;
  try {
    const email = yield scheduledEmailService.fetchEmail(scheduledEmaillId);
    const emailId = email.results.transmission.metadata.emailId;
    yield scheduledEmailService.deleteEmail(scheduledEmaillId);
    const deletedEmail = sentEmailService.deleteEmail(emailId);
    res.json(deletedEmail);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

module.exports = {
  list,
  deleteScheduledEmail
};
