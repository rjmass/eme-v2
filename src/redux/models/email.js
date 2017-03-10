import { Schema, arrayOf } from 'normalizr';
import templateSchemas from './template';

const emailSchema = new Schema('emails', {
  idAttribute: (email) => email._id,
});
emailSchema.define({
  templateId: templateSchemas.TEMPLATE
});

const Schemas = {
  EMAIL: emailSchema,
  EMAIL_ARRAY: arrayOf(emailSchema)
};

export default Schemas;
