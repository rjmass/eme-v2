import { Schema, arrayOf } from 'normalizr';

const templateSchema = new Schema('templates', {
  idAttribute: template => template._id
});

const Schemas = {
  TEMPLATE: templateSchema,
  TEMPLATE_ARRAY: arrayOf(templateSchema)
};

export default Schemas;
