const savedEmailService = require('../services/savedEmailService');
const handleError = require('../utils/handleError');
const { decryptEmails } = require('../utils/crypto');

function* read(req, res, next) {
  try {
    const { params: { substitutionId } } = req;
    const substitution = yield savedEmailService.getSubstitution(substitutionId);
    const data = substitution.userSubstitutionData;
    const uuidKeyedData = {};
    Object.keys(data).forEach(sub => {
      data[sub].email = decryptEmails(sub);
      uuidKeyedData[data[sub].uuid] = data[sub];
    });
    res.status(200).json(uuidKeyedData);
  } catch (err) {
    next(handleError(err.message, err.status));
  }
}

module.exports = {
  read
};
