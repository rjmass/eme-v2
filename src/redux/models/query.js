import { Schema, arrayOf } from 'normalizr';

const querySchema = new Schema('queries', {
  idAttribute: query => query._id
});

const Schemas = {
  QUERY: querySchema,
  QUERIES_ARRAY: arrayOf(querySchema)
};

export default Schemas;
