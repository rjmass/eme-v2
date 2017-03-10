import { Schema, arrayOf } from 'normalizr';

const articleSchema = new Schema('articles', {
  idAttribute: (article) => article.id,
});

const Schemas = {
  ARTICLE: articleSchema,
  ARTICLE_ARRAY: arrayOf(articleSchema)
};

export default Schemas;
