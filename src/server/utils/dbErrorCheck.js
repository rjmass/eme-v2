function getMongoErrorsCode(code) {
  const codes = {
    11000: 409 // conflict. The field already exists and it's unique
  };

  return codes[code] || 500;
}

module.exports = (err) => {
  const dbErr = {};
  switch (err.name) {
    case 'ValidationError': {
      dbErr.status = 400;
      const fieldErrors = [];
      const fieldName = 'validationError';
      for (const error of Object.keys(err.errors)) {
        const errMsg = err.errors[error].message;
        fieldErrors.push({ [fieldName]: errMsg });
      }
      dbErr.errors = fieldErrors;
      dbErr.message = 'Validation Error';
      break;
    }
    case 'CastError': {
      dbErr.status = 400;
      if (err.kind === 'ObjectId' && err.path === '_id') {
        dbErr.message = 'ID is Invalid';
      }
      break;
    }
    case 'MongoError': {
      dbErr.status = getMongoErrorsCode(err.code);
      dbErr.message = 'Database Error';
      break;
    }
    default: {
      dbErr.status = 500;
      dbErr.message = err.message || 'Unknown Error';
      break;
    }
  }

  return dbErr;
};
