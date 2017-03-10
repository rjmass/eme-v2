import omit from 'lodash/omit';
import { fetcher } from 'helpers/fetcher';
import { logout } from './auth';
import { notifications } from './notifications';
import Schemas from 'redux/models/query';
import config from 'config';

export const QUERIES_LOAD = 'meme/queries/QUERIES_LOAD';
export const QUERIES_LOADED = 'meme/queries/QUERIES_LOADED';
export const QUERY_LOAD = 'meme/queries/QUERY_LOAD';
export const QUERY_LOADED = 'meme/queries/QUERY_LOADED';
export const QUERY_VALIDATION_ERROR = 'meme/queries/QUERY_VALIDATION_ERROR';
export const QUERY_SERVER_ERROR = 'meme/queries/QUERY_SERVER_ERROR';
export const QUERY_DELETED = 'meme/queries/QUERY_DELETED';
export const QUERIES_FILTER = 'meme/queries/QUERIES_FILTER';

export const initialState = {
  listLoading: false,
  queryLoading: false,
  list: { },
  filter: { name: '' },
  error: null /* typeof Error */
};

function generateFetchOptions(method, body) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case QUERIES_LOAD: {
      return { ...state, listLoading: true };
    }
    case QUERIES_LOADED: {
      return { ...state,
        list: action.queries,
        error: null,
        listLoading: false };
    }
    case QUERY_LOADED: {
      return { ...state,
        list: { ...state.list, [action.query._id]: action.query },
        error: null,
        queryLoading: false };
    }
    case QUERY_LOAD: {
      return { ...state, queryLoading: true };
    }
    case QUERIES_FILTER: {
      const filter = { ...state.filter, ...action.filter };
      return { ...state, filter };
    }
    case QUERY_VALIDATION_ERROR:
    case QUERY_SERVER_ERROR: {
      return { ...state, error: action.error };
    }
    case QUERY_DELETED: {
      return { ...state,
        list: omit(state.list, action.id),
        error: null
      };
    }
    default:
      return state;
  }
}

export const queryServerError = (error = null) => {
  if (error.status === 401) { return logout(); }
  const type = QUERY_SERVER_ERROR;
  return { type, error };
};

export const queriesFilter = (filter = { }) => {
  const type = QUERIES_FILTER;
  return { type, filter };
};

export const queryValidationError = (error = null) => {
  const type = QUERY_VALIDATION_ERROR;
  return { type, error };
};

export const queriesLoad = () => {
  const type = QUERIES_LOAD;
  return { type };
};

export const queriesLoaded = (queries = {}) => {
  const type = QUERIES_LOADED;
  return { type, queries };
};

export const queryLoad = () => {
  const type = QUERY_LOAD;
  return { type };
};

export const queryLoaded = (query = {}) => {
  const type = QUERY_LOADED;
  return { type, query };
};

export const queryDeleted = (id) => {
  const type = QUERY_DELETED;
  return { type, id };
};

export const queryDeleteThunk = (id) => (dispatch) => {
  const options = {
    method: 'DELETE',
  };

  return (async () => {
    try {
      await fetcher(`${config.baseUrl}/queries/${id}`, Schemas.QUERY, options);
      await dispatch(queryDeleted(id));
      dispatch(notifications.success('Query deleted'));
    } catch (err) {
      dispatch(notifications.danger('Could not delete query'));
    }
  })();
};

export const queryCreateThunk = (query) => (dispatch) => {
  const options = generateFetchOptions('POST', query);

  return (async () => {
    let newQuery;
    try {
      const resQuery = await fetcher(`${config.baseUrl}/queries`, Schemas.QUERY, options);
      const [id] = Object.keys(resQuery.entities.queries);
      newQuery = resQuery.entities.queries[id];
      dispatch(queryLoaded(newQuery));
      await dispatch(notifications.success(`Query created: ${newQuery.name}`));
    } catch (err) {
      dispatch(notifications.danger('Could not create new query'));
    }
    return newQuery;
  })();
};

export const queryCloneThunk = (id) => (dispatch) => {
  return (async () => {
    let resQuery;
    try {
      const sourceQueryRes = await fetcher(`${config.baseUrl}/queries/${id}`, Schemas.QUERY);
      const sourceQuery = omit(sourceQueryRes.entities.queries[id], '_id');
      sourceQuery.name = `Copy of ${sourceQuery.name}`;
      return await dispatch(queryCreateThunk(sourceQuery));
    } catch (err) {
      dispatch(notifications.danger('Could not clone query'));
    }
    return resQuery;
  })();
};

export const queryUpdateThunk = (id, query) => (dispatch) => {
  const options = generateFetchOptions('PATCH', query);

  return (async () => {
    let updatedQuery;
    try {
      const queryRes = await fetcher(`${config.baseUrl}/queries/${id}`, Schemas.QUERY, options);
      updatedQuery = queryRes.entities.queries[id];
      dispatch(queryLoaded(updatedQuery));
      await dispatch(notifications.success('Query updated'));
    } catch (err) {
      dispatch(notifications.danger('Could not update query'));
    }
    return updatedQuery;
  })();
};

export const queriesLoadThunk = () => (dispatch) => {
  dispatch(queriesLoad());
  return (async () => {
    let queries;
    try {
      const queriesRes = await fetcher(`${config.baseUrl}/queries`, Schemas.QUERIES_ARRAY);
      queries = queriesRes.entities.queries;
      dispatch(queriesLoaded(queries));
    } catch (error) {
      dispatch(notifications.danger('Could not load queries'));
      dispatch(queryServerError(error));
    }
    return queries;
  })();
};

export const queryLoadThunk = (id) => (dispatch) => {
  return (async () => {
    let query;
    try {
      const queryRes = await fetcher(`${config.baseUrl}/queries/${id}`, Schemas.QUERY);
      query = queryRes.entities.queries[id];
      dispatch(queryLoaded(query));
    } catch (err) {
      dispatch(notifications.danger('Could not load query'));
      dispatch(queryServerError(err));
    }
    return query;
  })();
};

export const getQueries = (state, filterOverride = null) => {
  const filter = (filterOverride !== null)
    ? filterOverride
    : state.filter.name;
  return Object.keys(state.list)
    .map((_id) => state.list[_id])
    .filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((s1, s2) => s1.name.localeCompare(s2.name));
};
