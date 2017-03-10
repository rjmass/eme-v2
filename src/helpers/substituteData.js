import template from 'lodash/template';
import { dataPrefix } from 'handlebar-lodash-converter';

export default function (body, substitutionData) {
  const templateFunc = template(body, { variable: dataPrefix });
  return templateFunc(substitutionData);
}
