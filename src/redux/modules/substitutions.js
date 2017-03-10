import { fetcher } from '../../helpers/fetcher';
import { notifications } from './notifications';
import { logout } from './auth';
import omit from 'lodash/omit';
import Schemas from 'redux/models/substitution';
import config from 'config';

export const SUBSTITUTIONS_LOAD = 'meme/substitutions/SUBSTITUTIONS_LOAD';
export const SUBSTITUTIONS_LOADED = 'meme/substitutions/SUBSTITUTIONS_LOADED';
export const SUBSTITUTION_LOAD = 'meme/substitutions/SUBSTITUTION_LOAD';
export const SUBSTITUTION_LOADED = 'meme/substitutions/SUBSTITUTION_LOADED';
export const SUBSTITUTION_VALIDATION_ERROR = 'meme/substitutions/SUBSTITUTION_VALIDATION_ERROR';
export const SUBSTITUTION_SERVER_ERROR = 'meme/substitutions/SUBSTITUTION_SERVER_ERROR';
export const SUBSTITUTION_DELETED = 'meme/substitutions/SUBSTITUTION_DELETED';
export const SUBSTITUTIONS_SORT = 'meme/substitutions/SUBSTITUTIONS_SORT';
export const SUBSTITUTIONS_FILTER = 'meme/substitutions/SUBSTITUTIONS_FILTER';

export const SUBSTITUTION_SELECTED = 'meme/substitutions/SUBSTITUTION_SELECTED';
export const SUBSTITUTIONS_ENABLE = 'meme/substitutions/SUBSTITUTIONS_ENABLE';
export const SUBSTITUTIONS_DISABLE = 'meme/substitutions/SUBSTITUTIONS_DISABLE';
export const SUBSTITUTIONS_TOGGLE = 'meme/substitutions/SUBSTITUTIONS_TOGGLE';
export const SUBSTITUTION_DATA_UPDATED = 'meme/substitutions/SUBSTITUTION_DATA_UPDATED';
export const SUBSTITUTION_DATA_SELECTED = 'meme/substitutions/SUBSTITUTION_DATA_SELECTED';
export const SUBSTITUTION_DATA_RESET = 'meme/substitutions/SUBSTITUTION_DATA_RESET';
export const SUBSTITUTION_DELETE = 'meme/substitutions/SUBSTITUTION_DELETE';

export const initialState = {
  enabled: false,
  list: { },
  filter: { name: '' },
  sort: {
    dir: 'DESC',
    key: 'updated',
    sortFunc: (a, b) => (b.updatedAt).localeCompare(a.updatedAt, undefined, { numeric: true })
  },
  substitutionSelected: undefined, // selected list id
  substitutionDataSelected: undefined, // selected array index
  substitutionsLoading: false,
  substitutionLoading: false,
  error: null /* typeof Error */
};

const generateFetchOptions = (method, body = {}) => {
  return {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SUBSTITUTIONS_LOAD: {
      return { ...state, substitutionsLoading: true };
    }
    case SUBSTITUTION_LOAD: {
      return { ...state, substitutionLoading: true };
    }
    case SUBSTITUTION_SELECTED: {
      return { ...state, substitutionSelected: action.id };
    }
    case SUBSTITUTIONS_FILTER: {
      const filter = { ...state.filter, ...action.filter };
      return { ...state, filter };
    }
    case SUBSTITUTIONS_SORT: {
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
    case SUBSTITUTION_LOADED: {
      return {
        ...state,
        substitutionLoading: false,
        error: null,
        list: { ...state.list, [action.substitution._id]: action.substitution }
      };
    }
    case SUBSTITUTIONS_LOADED: {
      return { ...state,
        error: null,
        substitutionsLoading: false,
        list: action.substitutions
      };
    }
    case SUBSTITUTION_DATA_UPDATED: {
      const updatedSub = { ...state.list }[action.id];
      updatedSub.data = action.data;
      return {
        ...state,
        list: { ...state.list, [action.id]: updatedSub }
      };
    }
    case SUBSTITUTION_DATA_RESET: {
      return {
        ...state,
        substitutionSelected: undefined,
        substitutionDataSelected: undefined
      };
    }
    case SUBSTITUTIONS_ENABLE: {
      return { ...state, enabled: true };
    }
    case SUBSTITUTIONS_DISABLE: {
      return { ...state, enabled: false };
    }
    case SUBSTITUTIONS_TOGGLE: {
      return { ...state, enabled: !state.enabled };
    }
    case SUBSTITUTION_DATA_SELECTED: {
      return {
        ...state,
        substitutionDataSelected: action.index
      };
    }
    case SUBSTITUTION_VALIDATION_ERROR:
    case SUBSTITUTION_SERVER_ERROR: {
      return { ...state, error: action.error };
    }
    case SUBSTITUTION_DELETED: {
      return { ...state,
        list: omit(state.list, action.id),
        error: null
      };
    }
    default:
      return state;
  }
}

export const substitutionDataSelected = (index) => {
  const type = SUBSTITUTION_DATA_SELECTED;
  return { type, index };
};

export const substitutionsFilter = (filter = { }) => {
  const type = SUBSTITUTIONS_FILTER;
  return { type, filter };
};

export const substitutionsSort = (sortObj) => {
  const type = SUBSTITUTIONS_SORT;
  return { type, sortObj };
};

export const substitutionsLoaded = (substitutions = { }) => {
  const type = SUBSTITUTIONS_LOADED;
  return { type, substitutions };
};

export const substitutionServerError = (error) => {
  if (error.status === 401) {
    return logout();
  }

  const type = SUBSTITUTION_SERVER_ERROR;
  return { type, error };
};

export const substitutionValidationError = (error = null) => {
  const type = SUBSTITUTION_VALIDATION_ERROR;
  return { type, error };
};

export const substitutionLoad = () => {
  const type = SUBSTITUTION_LOAD;
  return { type };
};

export const substitutionsLoad = () => {
  const type = SUBSTITUTIONS_LOAD;
  return { type };
};

export const substitutionSelected = (id) => {
  const type = SUBSTITUTION_SELECTED;
  return { type, id };
};

export const substitutionLoaded = (substitution) => {
  const type = SUBSTITUTION_LOADED;
  return { type, substitution };
};

export const substitutionDataUpdated = (id, data) => {
  const type = SUBSTITUTION_DATA_UPDATED;
  return { type, id, data };
};

export const substitutionsDisable = () => {
  const type = SUBSTITUTIONS_DISABLE;
  return { type };
};

export const substitutionsToggle = () => {
  const type = SUBSTITUTIONS_TOGGLE;
  return { type };
};

export const substitutionDataReset = () => {
  const type = SUBSTITUTION_DATA_RESET;
  return { type };
};

export const substitutionsEnable = () => {
  return { type: SUBSTITUTIONS_ENABLE };
};

export const substitutionDeleted = (id) => {
  return { type: SUBSTITUTION_DELETED, id };
};

export const substitutionsLoadThunk = () => (dispatch) => {
  dispatch(substitutionsLoad());
  return (async () => {
    let substitutions;
    try {
      const substitutionsRes = await fetcher(`${config.baseUrl}/substitutions`,
        Schemas.SUBSTITUTION_ARRAY);
      substitutions = substitutionsRes.entities.substitutions;
      dispatch(substitutionsLoaded(substitutions));
    } catch (err) {
      dispatch(notifications.danger('Could not load lists'));
      dispatch(substitutionServerError(err));
    }
  })();
};

export const substitutionLoadThunk = (id) => (dispatch) => {
  dispatch(substitutionLoad());
  return (async () => {
    let substitution;
    try {
      const subComponents = [
        fetcher(`${config.baseUrl}/substitutions/${id}`, Schemas.SUBSTITUTION),
        fetcher(`${config.baseUrl}/substitutions/${id}/data`),
      ];

      const [substitutionRes, substitutionDataRes] = await Promise.all(subComponents);
      substitution = substitutionRes.entities.substitutions[id];
      substitution.data = substitutionDataRes.userSubstitutionData || [];
      dispatch(substitutionLoaded(substitution));
    } catch (err) {
      dispatch(notifications.danger('Could not load list'));
      dispatch(substitutionServerError(err));
    }
    return substitution;
  })();
};

export const substitutionLoadSelectThunk = (id) => (dispatch) => {
  dispatch(substitutionSelected(id));
  return (async () => {
    const substitution = await dispatch(substitutionLoadThunk(id));
    return substitution;
  })();
};

export const substitutionDeleteThunk = (id) => (dispatch) => {
  const options = generateFetchOptions('DELETE');

  return (async () => {
    try {
      await fetcher(`${config.baseUrl}/substitutions/${id}`, Schemas.SUBSTITUTION, options);
      dispatch(substitutionDeleted(id));
      dispatch(notifications.success('List deleted'));
    } catch (err) {
      dispatch(notifications.danger('Could not delete list'));
      dispatch(substitutionServerError(err));
    }
  })();
};

export const substitutionCreateThunk = (substitution) => (dispatch) => {
  let createdSubstitution;
  return (async () => {
    try {
      const substitutionRes = await fetcher(`${config.baseUrl}/substitutions`, Schemas.SUBSTITUTION,
        generateFetchOptions('POST', substitution));
      const [id] = Object.keys(substitutionRes.entities.substitutions);
      createdSubstitution = substitutionRes.entities.substitutions[id];
      dispatch(substitutionLoaded(createdSubstitution));
      dispatch(notifications.success(`List Created: ${createdSubstitution.name}`));
    } catch (err) {
      dispatch(notifications.danger('Could not create list'));
    }
    return createdSubstitution;
  })();
};

export const substitutionUpdateThunk = (id, substitution, data) => (dispatch) => {
  dispatch(substitutionLoad());
  let updatedSubstitution;
  return (async () => {
    try {
      const substitutionRes = await fetcher(`${config.baseUrl}/substitutions/${id}`,
        Schemas.SUBSTITUTION,
        generateFetchOptions('PATCH', {
          name: substitution.name, description: substitution.description
        }));
      updatedSubstitution = substitutionRes.entities.substitutions[id];
      // update data of substitution
      await fetcher(updatedSubstitution.uploadURL, null,
        generateFetchOptions('PUT', { userSubstitutionData: data }));
      updatedSubstitution.data = data;
      dispatch(substitutionLoaded(updatedSubstitution));
      dispatch(notifications.success('List Updated'));
    } catch (err) {
      dispatch(notifications.danger('Could not update list'));
      dispatch(substitutionLoaded(updatedSubstitution));
    }
    return updatedSubstitution;
  })();
};

export const substitutionsEnableThunk = () => (dispatch) => {
  dispatch(substitutionsEnable());
  return (async () => {
    await dispatch(substitutionsLoadThunk());
  })();
};

export const getSubstitutions = (state) => {
  const { sort: { sortFunc }, filter: { name = '' } } = state;
  return Object.keys(state.list)
    .map(_id => state.list[_id])
    .filter((item) => item.name.toLowerCase().includes(name.toLowerCase()))
    .sort(sortFunc);
};

export const getSubstitution = (state) => {
  return state.list[state.substitutionSelected];
};

export const getSubstitutionData = (state) => {
  return (state.substitutionSelected &&
    state.substitutionDataSelected >= 0 &&
    state.list[state.substitutionSelected].data) ?
    state.list[state.substitutionSelected].data[state.substitutionDataSelected] : null;
};
