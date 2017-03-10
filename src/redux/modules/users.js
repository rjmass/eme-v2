import { fetcher } from 'helpers/fetcher';
import { logout } from './auth';
import { notifications } from './notifications';
import omit from 'lodash/omit';
import Schemas from 'redux/models/user';
import config from 'config';

export const USERS_LOAD = 'meme/users/USERS_LOAD';
export const USERS_LOADED = 'meme/users/USERS_LOADED';
export const USER_LOAD = 'meme/users/USER_LOAD';
export const USER_LOADED = 'meme/users/USER_LOADED';
export const USER_VALIDATION_ERROR = 'meme/users/USER_VALIDATION_ERROR';
export const USER_SERVER_ERROR = 'meme/users/USER_SERVER_ERROR';
export const USER_DELETED = 'meme/users/USER_DELETED';
export const USERS_FILTER = 'meme/users/USER_FILTER';
export const USERS_SORT = 'meme/users/USERS_SORT';

const headers = { 'Content-Type': 'application/json' };

export const initialState = {
  listLoading: false,
  userLoading: false,
  list: { },
  filter: { name: '' },
  sort: {
    dir: 'ASC',
    key: 'username',
    sortFunc: (a, b) => a.username.localeCompare(b.username, undefined, { numeric: true })
  },
  error: null /* typeof Error */
};


export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case USERS_LOAD: {
      return { ...state, listLoading: true };
    }
    case USERS_LOADED: {
      return { ...state,
        list: action.users,
        error: null,
        listLoading: false };
    }
    case USER_LOADED: {
      const user = { ...action.user };
      return { ...state,
        list: { ...state.list, [action.user._id]: user },
        error: null,
        userLoading: false
      };
    }
    case USER_LOAD: {
      return { ...state, userLoading: true };
    }
    case USERS_FILTER: {
      const filter = { ...state.filter, ...action.filter };
      return { ...state, filter };
    }
    case USERS_SORT: {
      const sort = { ...state.sort };
      const newSortDir = action.sortObj.key.toLowerCase();
      if (newSortDir === sort.key) {
        sort.dir = (sort.dir === 'DESC') ? 'ASC' : 'DESC';
      } else {
        sort.dir = 'DESC';
        sort.key = newSortDir;
      }
      sort.sortFunc = action.sortObj.sortFunc(sort.key, sort.dir);
      return { ...state, sort };
    }
    case USER_VALIDATION_ERROR:
    case USER_SERVER_ERROR: {
      return { ...state, error: action.error };
    }
    case USER_DELETED: {
      return { ...state,
        list: omit(state.list, action.id),
        error: null
      };
    }
    default: return state;
  }
}

export const userServerError = (error = null) => {
  if (error.status === 401) { return logout(); }
  const type = USER_SERVER_ERROR;
  return { type, error };
};

export const usersFilter = (filter = { }) => {
  const type = USERS_FILTER;
  return { type, filter };
};

export const usersSort = (sortObj) => {
  const type = USERS_SORT;
  return { type, sortObj };
};

export const userValidationError = (error = null) => {
  const type = USER_VALIDATION_ERROR;
  return { type, error };
};

export const usersLoad = () => {
  const type = USERS_LOAD;
  return { type };
};

export const usersLoaded = (users = {}) => {
  const type = USERS_LOADED;
  return { type, users };
};

export const userLoad = () => {
  const type = USER_LOAD;
  return { type };
};

export const userLoaded = (user = {}) => {
  const type = USER_LOADED;
  return { type, user };
};

export const userDeleted = (id) => {
  const type = USER_DELETED;
  return { type, id };
};

export const userDeleteThunk = (id) => (dispatch) => {
  const options = {
    method: 'DELETE',
  };

  return (async () => {
    try {
      await fetcher(`${config.baseUrl}/users/${id}`, Schemas.USER, options);
      await dispatch(userDeleted(id));
      dispatch(notifications.success('User deleted'));
    } catch (err) {
      dispatch(notifications.danger('Could not delete user'));
    }
  })();
};

export const userCreateThunk = (user) => (dispatch) => {
  const body = JSON.stringify(user);
  const options = {
    headers,
    method: 'POST',
    body
  };

  return (async () => {
    let newUser;
    try {
      const resUser = await fetcher(`${config.baseUrl}/users`, Schemas.USER, options);
      const [id] = Object.keys(resUser.entities.users);
      newUser = resUser.entities.users[id];
      dispatch(userLoaded(newUser));
      await dispatch(notifications.success(`User created: ${newUser.name}`));
    } catch (err) {
      dispatch(notifications.danger('Could not create new user'));
    }
    return newUser;
  })();
};

export const userCloneThunk = (id) => (dispatch) => {
  let clonedUser;
  return (async () => {
    try {
      const sourceUserRes = await fetcher(`${config.baseUrl}/users/${id}`,
        Schemas.USER);
      const sourceUser = omit(sourceUserRes.entities.users[id],
        '_id', 'updatedAt', 'createdAt');
      sourceUser.name = `Copy of ${sourceUser.name}`;
      clonedUser = await dispatch(userCreateThunk(sourceUser));
    } catch (err) {
      dispatch(notifications.danger('Could not clone user'));
    }
    return clonedUser;
  })();
};

export const userUpdateThunk = (id, user) => (dispatch) => {
  const body = JSON.stringify(user);
  const options = {
    headers,
    method: 'PATCH',
    body
  };

  return (async () => {
    let updatedUser;
    try {
      const userRes = await fetcher(`${config.baseUrl}/users/${id}`,
        Schemas.USER, options);
      updatedUser = userRes.entities.users[id];
      dispatch(userLoaded(updatedUser));
      await dispatch(notifications.success('User updated'));
    } catch (err) {
      dispatch(notifications.danger('Could not update user'));
    }
    return updatedUser;
  })();
};

export const usersLoadThunk = () => (dispatch) => {
  dispatch(usersLoad());
  return (async () => {
    let users;
    try {
      const usersRes = await fetcher(`${config.baseUrl}/users`, Schemas.USER_ARRAY);
      users = usersRes.entities.users;
      dispatch(usersLoaded(users));
    } catch (error) {
      dispatch(notifications.danger('Could not load users'));
      dispatch(userServerError(error));
    }
    return users;
  })();
};

export const userLoadThunk = (id) => (dispatch) => {
  dispatch(userLoad());
  return (async () => {
    let user;
    try {
      const userRes = await fetcher(`${config.baseUrl}/users/${id}`, Schemas.USER);
      user = userRes.entities.users[id];
      dispatch(userLoaded(user));
    } catch (err) {
      dispatch(notifications.danger('Could not load user'));
      dispatch(userServerError(err));
    }
    return user;
  })();
};

export const getUsers = (state) => {
  const { sort: { sortFunc }, filter: { name: nameInFilter = '' } } = state;
  return Object.keys(state.list)
    .map(_id => state.list[_id])
    .filter(({ username, name = '' }) => {
      return username.toLowerCase().includes(nameInFilter.toLowerCase())
        || name.toLowerCase().includes(nameInFilter.toLowerCase());
    })
    .sort(sortFunc);
};
