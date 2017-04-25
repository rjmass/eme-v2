import uniq from 'lodash/uniq';

export default (template) => {
  /* eslint-disable no-inline-comments */
  const pattern = [
    '<%[=|-]?', // look for opening tag (<%, <%=, or <%-)
    '(?:[\\s]|if|\\()*', // accept any space after opening tag and before identifier
    '(.+?)', // capture the identifier name (`hello` in <%= hello %>)
    '(?:[\\s]|\\)|\\{)*', // accept any space after identifier and before closing tag
    '%>' // look for closing tag
  ].join('');
  /* eslint-enable no-inline-comments
   * */

  const regex = new RegExp(pattern, 'g');

  const matches = [];

  let match;
  /* eslint-disable no-cond-assign */
  while (match = regex.exec(template)) {
    /* eslint-enable
     * no-cond-assign */
    matches.push(match[1]);
  }

  return uniq(matches);
};
