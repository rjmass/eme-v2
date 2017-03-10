import { lodashConverter } from 'handlebar-lodash-converter';
import substituteData from './substituteData';

export default function convertSparkpostSyntax(body, substitutionData) {
  return substituteData(lodashConverter(body), substitutionData);
}
