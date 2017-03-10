import { fetcher } from 'helpers/fetcher';
import { notifications } from './notifications';
import { logout } from './auth';
import Schemas from 'redux/models/snippet';
import omit from 'lodash/omit';
import config from 'config';

export const SNIPPETS_LOAD = 'meme/snippets/SNIPPETS_LOAD';
export const SNIPPETS_LOADED = 'meme/snippets/SNIPPETS_LOADED';
export const SNIPPET_LOAD = 'meme/snippets/SNIPPET_LOAD';
export const SNIPPET_LOADED = 'meme/snippets/SNIPPET_LOADED';
export const SNIPPET_UPDATED = 'meme/snippets/SNIPPET_UPDATED';
export const SNIPPET_VALIDATION_ERROR = 'meme/snippets/SNIPPET_VALIDATION_ERROR';
export const SNIPPET_SERVER_ERROR = 'meme/snippets/SNIPPET_SERVER_ERROR';
export const SNIPPET_DELETED = 'meme/snippets/SNIPPET_DELETED';
export const SNIPPETS_FILTER = 'meme/snippets/SNIPPETS_FILTER';
export const SNIPPETS_SORT = 'meme/snippets/SNIPPETS_SORT';

const UPDATE_THRESHOLD = 60 * 1000;

export const initialState = {
  updated: 0,
  error: null, /* typeof Error */
  filter: { name: '' },
  list: { },
  listLoading: false,
  snippetLoading: false,
  sort: {
    dir: 'DESC',
    key: 'updated',
    sortFunc: (a, b) => (b.updatedAt || '')
      .localeCompare(a.updatedAt || '', undefined, { numeric: true })
  }
};

const generateFetchOptions = (method, body) => {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SNIPPETS_LOAD: {
      return { ...state, listLoading: true };
    }
    case SNIPPET_LOAD: {
      return { ...state, snippetLoading: true };
    }
    case SNIPPETS_LOADED: {
      const updated = new Date().getTime();
      return {
        ...state,
        error: null,
        list: action.snippets,
        listLoading: false,
        updated
      };
    }
    case SNIPPET_DELETED: {
      return { ...state,
        list: omit(state.list, action.id),
        error: null
      };
    }
    case SNIPPETS_FILTER: {
      const filter = { ...state.filter, ...action.filter };
      return { ...state, filter };
    }
    case SNIPPETS_SORT: {
      const sort = { ...state.sort };
      const newSortKey = action.sortObj.key.toLowerCase();
      if (newSortKey === sort.key) {
        sort.dir = (sort.dir === 'DESC') ? 'ASC' : 'DESC';
      } else {
        sort.dir = 'DESC';
        sort.key = newSortKey;
      }
      sort.sortFunc = action.sortObj.sortFunc(sort.key, sort.dir);
      return { ...state, sort };
    }
    case SNIPPET_LOADED: {
      return {
        ...state,
        list: { ...state.list, [action.snippet._id]: action.snippet },
        error: null,
        snippetLoading: false
      };
    }
    case SNIPPET_UPDATED: {
      return {
        ...state,
        list: { ...state.list, [action.snippet._id]: action.snippet },
        error: null,
        snippetLoading: false
      };
    }
    case SNIPPET_VALIDATION_ERROR:
    case SNIPPET_SERVER_ERROR: {
      return { ...state, error: action.error };
    }
    default:
      return state;
  }
}

export const snippetValidationError = (error = null) => {
  const type = SNIPPET_VALIDATION_ERROR;
  return { type, error };
};

export const snippetServerError = (error = null) => {
  if (error.status === 401) { return logout(); }
  const type = SNIPPET_SERVER_ERROR;
  return { type, error };
};

export const snippetsFilter = (filter = { }) => {
  const type = SNIPPETS_FILTER;
  return { type, filter };
};

export const snippetsSort = (sortObj) => {
  const type = SNIPPETS_SORT;
  return { type, sortObj };
};

export const snippetsLoad = () => {
  const type = SNIPPETS_LOAD;
  return { type };
};

export const snippetLoad = () => {
  const type = SNIPPET_LOAD;
  return { type };
};

export const snippetsLoaded = (snippets = {}) => {
  const type = SNIPPETS_LOADED;
  return { type, snippets };
};

export const snippetLoaded = (snippet = {}) => {
  const type = SNIPPET_LOADED;
  return { type, snippet };
};

export const snippetUpdated = (snippet = {}) => {
  const type = SNIPPET_UPDATED;
  return { type, snippet };
};

export const snippetDeleted = (id) => {
  const type = SNIPPET_DELETED;
  return { type, id };
};

export const snippetValidationErrorThunk = (error = null) => (dispatch) => {
  dispatch(snippetValidationError(error));
  dispatch(notifications.danger(`Could not save snippet: ${error.message}`));
};

export const snippetDeleteThunk = (id) => (dispatch) => {
  const options = {
    method: 'DELETE',
  };

  return (async () => {
    try {
      await fetcher(`${config.baseUrl}/snippets/${id}`, Schemas.SNIPPET, options);
      await dispatch(snippetDeleted(id));
      dispatch(notifications.success('Snippet deleted'));
    } catch (err) {
      dispatch(notifications.danger('Could not delete snippet'));
    }
  })();
};

export const snippetCreateThunk = (snippet) => (dispatch) => {
  const options = generateFetchOptions('POST', snippet);

  return (async () => {
    let newSnippet;
    try {
      const resSnippet = await fetcher(`${config.baseUrl}/snippets`, Schemas.SNIPPET, options);
      const [id] = Object.keys(resSnippet.entities.snippets);
      newSnippet = resSnippet.entities.snippets[id];
      dispatch(snippetLoaded(newSnippet));
      await dispatch(notifications.success(`Snippet created: ${newSnippet.name}`));
    } catch (err) {
      dispatch(notifications.danger('Could not create new snippet'));
    }
    return newSnippet;
  })();
};

export const snippetCloneThunk = (id) => (dispatch) => {
  return (async () => {
    let resSnippet;
    try {
      const sourceSnippetRes = await fetcher(`${config.baseUrl}/snippets/${id}`, Schemas.SNIPPET);
      const sourceSnippet = omit(sourceSnippetRes.entities.snippets[id],
        '_id', 'updatedAt', 'createdAt');
      sourceSnippet.name = `Copy of ${sourceSnippet.name}`;
      return await dispatch(snippetCreateThunk(sourceSnippet));
    } catch (err) {
      dispatch(notifications.danger('Could not clone snippet'));
    }
    return resSnippet;
  })();
};

export const snippetUpdateThunk = (id, snippet) => (dispatch) => {
  const options = generateFetchOptions('PATCH', snippet);

  return (async () => {
    let updatedSnippet;
    try {
      const snippetRes = await fetcher(`${config.baseUrl}/snippets/${id}`,
        Schemas.SNIPPET, options);
      updatedSnippet = snippetRes.entities.snippets[id];
      dispatch(snippetLoaded(updatedSnippet));
      await dispatch(notifications.success('Snippet updated'));
    } catch (err) {
      dispatch(notifications.danger('Could not update snippet'));
    }
    return updatedSnippet;
  })();
};

export const snippetsLoadThunk = () => (dispatch, getState) => {
  const currentTime = new Date().getTime();
  const { snippets: { updated, list, listLoading } } = getState();

  // checking if loading is in progress
  // reuse list if already loaded and refresh time less than threshold
  if (!listLoading && ((currentTime - updated) < UPDATE_THRESHOLD)) {
    return dispatch(snippetsLoaded(list));
  }

  dispatch(snippetsLoad());

  return (async () => {
    let snippets;
    try {
      const snippetsRes = await fetcher(`${config.baseUrl}/snippets`, Schemas.SNIPPET_ARRAY);
      snippets = snippetsRes.entities.snippets;
      dispatch(snippetsLoaded(snippets));
    } catch (error) {
      dispatch(notifications.danger('Could not load snippets'));
      dispatch(snippetServerError(error));
    }
    return snippets;
  })();
};

export const snippetLoadThunk = (id) => (dispatch) => {
  return (async () => {
    let snippet;
    try {
      const snippetRes = await fetcher(`${config.baseUrl}/snippets/${id}`, Schemas.SNIPPET);
      snippet = snippetRes.entities.snippets[id];
      dispatch(snippetLoaded(snippet));
    } catch (err) {
      dispatch(notifications.danger('Could not load snippet'));
      dispatch(snippetServerError(err));
    }
    return snippet;
  })();
};

export const getSnippets = (state, filterOverride = null) => {
  const { sort: { sortFunc } } = state;
  const filter = (filterOverride !== null)
    ? filterOverride
    : state.filter.name;
  return Object.keys(state.list)
    .map((_id) => state.list[_id])
    .filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()))
    .sort(sortFunc);
};
