import { Schema, arrayOf } from 'normalizr';

const snippetSchema = new Schema('snippets', {
  idAttribute: snippet => snippet._id
});

const Schemas = {
  SNIPPET: snippetSchema,
  SNIPPET_ARRAY: arrayOf(snippetSchema)
};

export default Schemas;
