import validator from 'tv4';

validator.setErrorReporter((error, data, fieldSchema) => {
  const { description, message = 'is required' } = fieldSchema;
  return `${description} ${message}`;
});

export default validator;
