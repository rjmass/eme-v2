import papaParse from 'papaparse';

function config(resolve, reject) {
  return {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: results => resolve(results.data),
    error: (err) => reject(err)
  };
}

export function csvToJSON(csv) {
  return new Promise((resolve, reject) => {
    papaParse.parse(csv, config(resolve, reject));
  });
}

export function jsonToCSV(data) {
  return papaParse.unparse(data);
}
