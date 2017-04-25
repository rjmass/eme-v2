import template from 'lodash/template';

export default (body, data) => {
  const templateFunc = template(body);
  return templateFunc(data);
};
