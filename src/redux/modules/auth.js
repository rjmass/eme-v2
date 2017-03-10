import config from 'config';
import { fetcher } from '../../helpers/fetcher';
import { notifications } from './notifications';

const LOAD = 'meme/auth/LOAD';
const LOAD_SUCCESS = 'meme/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'meme/auth/LOAD_FAIL';
const LOGIN = 'meme/auth/LOGIN';
const LOGIN_SUCCESS = 'meme/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'meme/auth/LOGIN_FAIL';
const LOGOUT = 'meme/auth/LOGOUT';
const LOGOUT_SUCCESS = 'meme/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'meme/auth/LOGOUT_FAIL';
const ACCOUNT_UPDATED = 'meme/auth/ACCOUNT_UPDATED';

const headers = { 'Content-Type': 'application/json' };

const initialState = {
  loaded: false,
  loading: false,
  user: null,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.result,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        user: action.result
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    case ACCOUNT_UPDATED: {
      return {
        ...state,
        user: action.user
      };
    }
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadauth')
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.post('/logout')
  };
}

export function accountUpdated(user) {
  return {
    type: ACCOUNT_UPDATED,
    user
  };
}

export const userServerError = (error = null) => {
  if (error.status === 401) { return logout(); }
  const type = LOAD_FAIL;
  return { type, error };
};

export const accountLoadThunk = () => (dispatch, getState) => {
  const { auth: { user: { _id: id } } } = getState();

  return (async () => {
    try {
      const user = await fetcher(`${config.baseUrl}/users/${id}`);
      dispatch(accountUpdated(user));
      return user;
    } catch (err) {
      dispatch(notifications.danger('Could not fetch account'));
      return dispatch(userServerError(err));
    }
  })();
};

export const accountUpdateThunk = (id, user) => (dispatch) => {
  const body = JSON.stringify(user);
  const options = {
    headers,
    method: 'PATCH',
    body
  };

  return (async () => {
    try {
      const updatedUser = await fetcher(`${config.baseUrl}/users/${id}`, null, options);
      dispatch(accountUpdated(updatedUser));
      dispatch(notifications.success('Account updated'));
      return updatedUser;
    } catch (err) {
      dispatch(notifications.danger('Could not update account'));
      return dispatch(userServerError(err));
    }
  })();
};
