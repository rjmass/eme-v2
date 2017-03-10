import fetch from 'isomorphic-fetch';
import { normalize } from 'normalizr';

const defaultOptions = {
  credentials: 'same-origin'
};

export const fetcher = async (url, schema, options = {}) => {
  const response = await fetch(url, { ...defaultOptions, ...options });
  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    const json = await response.json();
    if (response.ok) {
      if (schema) {
        return normalize(json, schema);
      }
      return json;
    }

    const error = new Error(json.message);
    error.status = response.status;
    if (Array.isArray(json.errors) && json.errors.length) {
      error.errors = json.errors;
    }

    throw error;
  } else {
    if (response.ok) {
      return {};
    }
    throw new Error(response.statusText);
  }
};
