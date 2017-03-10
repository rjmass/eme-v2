// exporting clientMiddleware
export default (client) => ({ dispatch, getState }/* state */) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }

  const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare
  if (!promise) {
    return next(action);
  }

  const [REQUEST, SUCCESS, FAILURE] = types;
  next({ ...rest, type: REQUEST });

  const actionPromise = promise(client);
  return actionPromise
    .then((result) => next({ ...rest, result, type: SUCCESS }))
    .catch((error) => next({ ...rest, error, type: FAILURE }));
};
