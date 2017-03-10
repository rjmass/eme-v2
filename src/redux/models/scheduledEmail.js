import { Schema, arrayOf } from 'normalizr';

const scheduledEmailSchema = new Schema('scheduledEmails', {
  idAttribute: email => email.id
});

const Schemas = {
  SCHEDULED_EMAIL: scheduledEmailSchema,
  SCHEDULED_EMAIL_ARRAY: arrayOf(scheduledEmailSchema)
};

export default Schemas;
