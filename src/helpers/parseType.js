const FLOAT = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;

function tryParseFloat(value) {
  const isNumber = FLOAT.test(value);
  return isNumber ? parseFloat(value) : value;
}

export default (value) => {
  if (value === 'true' || value === 'TRUE') {
    return true;
  } else if (value === 'false' || value === 'FALSE') {
    return false;
  }
  return tryParseFloat(value);
};
