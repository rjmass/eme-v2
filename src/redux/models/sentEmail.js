import { Schema, arrayOf } from 'normalizr';
import emailSchemas from './email';

const sentEmailSchema = new Schema('sentEmails', {
  idAttribute: (sentEmail) => sentEmail.emailId,
});
sentEmailSchema.define({
  parentEmailId: emailSchemas.EMAIL
});

const Schemas = {
  SENT_EMAIL: sentEmailSchema,
  SENT_EMAIL_ARRAY: arrayOf(sentEmailSchema)
};

export default Schemas;
