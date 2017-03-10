export const validate = (queries) => {
  let names = {};
  for (const q of queries) {
    if (!/^[A-Za-z_]{3,10}$/.test(q.variableName || '')) {
      const err = 'Variables must be between 3 and 10 characters (A-Z a-z and _ permitted)';
      return [false, new Error(err)];
    }

    if ((q.query || '').length < 3) {
      return [false, new Error('Query must be 3 or more characters')];
    }

    if (names[q.variableName]) {
      return [false, new Error(`${q.variableName} is a duplicate variable name`)];
    }
    names[q.variableName] = true;
  }
  names = null;
  return [true, null];
};
