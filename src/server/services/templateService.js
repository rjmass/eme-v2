const config = require('../../config');
const fetcher = require('./_fetcher')(config.campaignsHost);

function* fetchTemplates(query, res) {
  return yield fetcher.fetchResourceList('/templates', res, query);
}

function* fetchTemplate(templateId) {
  return yield fetcher.fetchResourceSingle('/templates', templateId);
}

function* createTemplate(templateBody) {
  return yield fetcher.createResource('/templates', templateBody);
}

function* patchTemplate(templateId, templateBody) {
  return yield fetcher.patchResource('/templates', templateId, templateBody);
}

function* deleteTemplate(templateId) {
  return yield fetcher.deleteResource('/templates', templateId);
}

module.exports = {
  fetchTemplates,
  fetchTemplate,
  createTemplate,
  patchTemplate,
  deleteTemplate
};
