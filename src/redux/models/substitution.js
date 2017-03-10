import { Schema, arrayOf } from 'normalizr';

const substitutionSchema = new Schema('substitutions', {
  idAttribute: substitution => substitution._id
});

const Schemas = {
  SUBSTITUTION: substitutionSchema,
  SUBSTITUTION_ARRAY: arrayOf(substitutionSchema)
};

export default Schemas;
