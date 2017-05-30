import validator from 'tv4';
import { placeHolderPattern, markDownPattern, nonAlphaNums } from '../../utils/regex';
let cheerio = require('cheerio');

validator.setErrorReporter((error, data, fieldSchema) => {
  const { message = 'is required' } = fieldSchema;
  let { description } = fieldSchema;
  if (error.code === 302) {
    description = fieldSchema.required[error.schemaPath.split("/")[2]];
  }
  return `${description} ${message}`;
});

validator.addFormat('htmlComment', function (htmlStr, schema) {
  // Makes sure HTML elements haven't just been left empty
  return (cheerio.load(htmlStr.replace(markDownPattern, (match, name) => {
    return '';
  })).root().text().length)?null:"Comment must contain something";
});

export default validator;
