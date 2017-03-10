const config = require('../../config');
const fetcher = require('./_fetcher')(config.campaignsHost);

function* fetchSubstitutions(query, res) {
  return yield fetcher.fetchResourceList('/substitutions', res, query);
}

function* fetchSubstitution(substitutionId) {
  return yield fetcher.fetchResourceSingle('/substitutions', substitutionId);
}

function fetchSubstitutionData(substitutionId) {
  return fetcher.fetchResourceStream(`/substitutions/${substitutionId}/data`);
}

function* createSubstitution(substitutionBody) {
  return yield fetcher.createResource('/substitutions', substitutionBody);
}

function* patchSubstitution(substitutionId, substitutionBody) {
  return yield fetcher.patchResource('/substitutions', substitutionId, substitutionBody);
}

function* deleteSubstitution(substitutionId) {
  return yield fetcher.deleteResource('/substitutions', substitutionId);
}

module.exports = {
  fetchSubstitutions,
  fetchSubstitution,
  fetchSubstitutionData,
  createSubstitution,
  patchSubstitution,
  deleteSubstitution
};
