import { fetcher } from '../../helpers/fetcher';
import { notifications } from './notifications';
import { logout } from './auth';
import Schemas from 'redux/models/email';
import omit from 'lodash/omit';
import config from 'config';

export const EMAILS_LOAD = 'meme/emails/EMAILS_LOAD';
export const EMAILS_LOADED = 'meme/emails/EMAILS_LOADED';
export const EMAILS_FILTER = 'meme/emails/EMAILS_FILTER';
export const EMAILS_SORT = 'meme/emails/EMAILS_SORT';
export const EMAIL_LOAD = 'meme/emails/EMAIL_LOAD';
export const EMAIL_LOADED = 'meme/emails/EMAIL_LOADED';
export const EMAIL_LOCKED = 'meme/emails/EMAIL_LOCKED';
export const EMAIL_UPDATED = 'meme/emails/EMAIL_UPDATED';
export const EMAIL_DELETE = 'meme/emails/EMAIL_DELETE';
export const EMAIL_DELETED = 'meme/emails/EMAIL_DELETED';
export const EMAIL_CONTENT_PANEL_CHANGED = 'meme/emails/EMAIL_CONTENT_PANEL_CHANGED';
export const EMAIL_SERVER_ERROR = 'meme/emails/EMAIL_SERVER_ERROR';
export const EMAIL_VALIDATION_ERROR = 'meme/email/EMAIL_VALIDATION_ERROR';

const headers = { 'Content-Type': 'application/json' };

export const initialState = {
  currentContentPanel: '',
  emailLoading: false,
  currentEmailId: null,
  error: null, /* typeof Error */
  filter: { name: '' },
  list: { },
  listLoading: false,
  sort: {
    dir: 'DESC',
    key: 'updated',
    sortFunc: (a, b) => (b.updatedAt).localeCompare(a.updatedAt, undefined, { numeric: true })
  }
};

export const getOrderedHtmlFields = (email) => {
  const { htmlFields = {} } = email;
  return Object.keys(htmlFields)
    .map((key) => {
      const field = htmlFields[key];
      return { ...field, key };
    })
    .sort((f1, f2) => f1.index - f2.index);
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case EMAILS_LOAD: {
      return { ...state, listLoading: true, currentEmailId: null };
    }
    case EMAIL_LOAD: {
      return { ...state, emailLoading: true, currentEmailId: action.id };
    }
    case EMAILS_LOADED: {
      if (state.currentEmailId) {
        return state;
      }
      return {
        ...state,
        error: null,
        list: action.emails,
        listLoading: false
      };
    }
    case EMAIL_DELETED: {
      return { ...state,
        list: omit(state.list, action.id),
        error: null
      };
    }
    case EMAIL_LOCKED: {
      const lockedEmail = { ...state.list[action.lock.emailId], lock: action.lock };
      return {
        ...state,
        list: { ...state.list, [action.lock.emailId]: lockedEmail },
        error: null,
      };
    }
    case EMAILS_FILTER: {
      const filter = { ...state.filter, ...action.filter };
      return { ...state, filter };
    }
    case EMAILS_SORT: {
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
    case EMAIL_LOADED: {
      const [field = {}] = getOrderedHtmlFields(action.email);
      const loadedEmail = { ...action.email };
      if (loadedEmail.campaign) {
        loadedEmail.campaignName = loadedEmail.campaign.name;
        loadedEmail.campaign = loadedEmail.campaign._id;
      }
      return {
        ...state,
        list: { ...state.list, [action.email._id]: loadedEmail },
        error: null,
        emailLoading: false,
        currentContentPanel: field.key
      };
    }
    case EMAIL_UPDATED: {
      return {
        ...state,
        list: { ...state.list, [action.email._id]: action.email },
        error: null,
        emailLoading: false
      };
    }
    case EMAIL_CONTENT_PANEL_CHANGED: {
      return { ...state, currentContentPanel: action.panelKey };
    }
    case EMAIL_VALIDATION_ERROR:
    case EMAIL_SERVER_ERROR: {
      return { ...state, error: action.error };
    }
    default: {
      return state;
    }
  }
}

export const emailValidationError = (error = null) => {
  const type = EMAIL_VALIDATION_ERROR;
  return { type, error };
};

export const emailServerError = (err = null) => {
  if (err.status === 401) { return logout(); }
  const type = EMAIL_SERVER_ERROR;
  return { type, err };
};

export const emailContentPanelChanged = (panelKey) => {
  const type = EMAIL_CONTENT_PANEL_CHANGED;
  return { type, panelKey };
};

export const emailsFilter = (filter = { }) => {
  const type = EMAILS_FILTER;
  return { type, filter };
};

export const emailsSort = (sortObj) => {
  const type = EMAILS_SORT;
  return { type, sortObj };
};

export const emailsLoad = () => {
  const type = EMAILS_LOAD;
  return { type };
};

export const emailLoad = (id) => {
  const type = EMAIL_LOAD;
  return { type, id };
};

export const emailsLoaded = (emails = {}) => {
  const type = EMAILS_LOADED;
  return { type, emails };
};

export const emailLoaded = (email = {}) => {
  const type = EMAIL_LOADED;
  return { type, email };
};

export const emailUpdated = (email = {}) => {
  const type = EMAIL_UPDATED;
  return { type, email };
};

export const emailDeleted = (id) => {
  const type = EMAIL_DELETED;
  return { type, id };
};

export const emailLocked = (lock) => {
  const type = EMAIL_LOCKED;
  return { type, lock };
};

export const emailValidationErrorThunk = (error = null) => (dispatch) => {
  dispatch(emailValidationError(error));
  dispatch(notifications.danger(`Could not save email: ${error.message}`));
};

export const emailLockCreateThunk = (emailId) => (dispatch) => {
  const body = JSON.stringify({ emailId });
  const options = {
    headers,
    method: 'POST',
    body
  };

  return (async () => {
    let lock;
    try {
      lock = await fetcher(`${config.baseUrl}/emails/lock`, null, options);
      dispatch(emailLocked(lock));
      dispatch(notifications.success('Email locked'));
    } catch (err) {
      dispatch(notifications.danger('Could not lock email'));
    }
    return lock;
  })();
};

export const emailsLoadThunk = () => (dispatch) => {
  dispatch(emailsLoad());
  return (async () => {
    let emails;
    try {
      const emailsRes = await fetcher(`${config.baseUrl}/emails`, Schemas.EMAIL_ARRAY);
      emails = emailsRes.entities.emails;
      dispatch(emailsLoaded(emails));
    } catch (err) {
      dispatch(notifications.danger('Could not load emails'));
      dispatch(emailServerError(err));
    }
    return emails;
  })();
};

export const emailCreateThunk = (email) => (dispatch) => {
  const body = JSON.stringify(email);
  const options = {
    headers,
    method: 'POST',
    body
  };

  return (async () => {
    let newEmail;
    try {
      const resEmail = await fetcher(`${config.baseUrl}/emails`, Schemas.EMAIL, options);
      const [id] = Object.keys(resEmail.entities.emails);
      newEmail = resEmail.entities.emails[id];
      dispatch(emailLoaded(newEmail));
      await dispatch(notifications.success(`Email created: ${newEmail.name}`));
    } catch (err) {
      dispatch(notifications.danger('Could not create new email'));
    }
    return newEmail;
  })();
};

export const createEmailFromTemplateThunk = (templateId) => (dispatch) => {
  const body = JSON.stringify({ templateId });
  const options = {
    headers,
    method: 'POST',
    body
  };
  return (async () => {
    let newEmail;
    try {
      const resEmail = await fetcher(`${config.baseUrl}/emails`, Schemas.EMAIL, options);
      const [id] = Object.keys(resEmail.entities.emails);
      newEmail = resEmail.entities.emails[id];
      dispatch(emailLoaded(newEmail));
      await dispatch(notifications.success(`Email created: ${newEmail.name}`));
    } catch (err) {
      dispatch(notifications.danger('Could not create new email from template'));
    }
    return newEmail;
  })();
};

export const emailCloneThunk = (id) => (dispatch) => {
  return (async () => {
    let clonedEmail;
    try {
      const sourceEmailRes = await fetcher(`${config.baseUrl}/emails/${id}`, Schemas.EMAIL);
      const sourceEmail = omit(sourceEmailRes.entities.emails[id], '_id', 'updatedAt', 'createdAt');
      sourceEmail.name = `Copy of ${sourceEmail.name}`;
      clonedEmail = await dispatch(emailCreateThunk(sourceEmail));
    } catch (err) {
      dispatch(notifications.danger('Could not clone email'));
    }
    return clonedEmail;
  })();
};

export const emailLoadThunk = (id) => (dispatch) => {
  dispatch(emailLoad(id));
  return (async () => {
    let email;
    try {
      const [emailRes, lock] = await Promise.all([
        fetcher(`${config.baseUrl}/emails/${id}`, Schemas.EMAIL),
        fetcher(`${config.baseUrl}/emails/lock/${id}`, null)
      ]);
      email = emailRes.entities.emails[id];
      dispatch(emailLoaded(email));
      if (lock) {
        dispatch(emailLocked(lock));
      }
    } catch (err) {
      dispatch(notifications.danger('Could not load email'));
      dispatch(emailServerError(err));
    }
    return email;
  })();
};

export const emailReimportThunk = (id) => async (dispatch) => {
  dispatch(emailLoad());
  const options = {
    headers,
    method: 'PUT'
  };
  let email;
  try {
    const emailRes = await fetcher(`${config.baseUrl}/emails/${id}`, Schemas.EMAIL, options);
    email = emailRes.entities.emails[id];
    dispatch(emailLoaded(email));
    dispatch(notifications.success('Reimported template in to email'));
  } catch (err) {
    dispatch(notifications.danger('Could not reimport template'));
    dispatch(emailServerError(err));
  }
  return email;
};

export const emailUpdateThunk = (id, email) => (dispatch) => {
  const body = JSON.stringify(email);
  const options = {
    headers,
    method: 'PATCH',
    body
  };

  dispatch({ type: EMAIL_LOAD });
  return (async () => {
    let updatedEmail;
    try {
      const emailRes = await fetcher(`${config.baseUrl}/emails/${id}`, Schemas.EMAIL, options);
      updatedEmail = emailRes.entities.emails[id];
      dispatch(emailUpdated(updatedEmail));
      dispatch(notifications.success('Email updated'));
    } catch (err) {
      dispatch(notifications.danger('Could not update email'));
      dispatch(emailServerError(err));
    }
    return updatedEmail;
  })();
};

export const emailDeleteThunk = (id) => (dispatch) => {
  const options = {
    method: 'DELETE',
  };

  return (async () => {
    try {
      dispatch({ type: EMAIL_DELETE });
      await fetcher(`${config.baseUrl}/emails/${id}`, Schemas.EMAIL, options);
      await dispatch(emailDeleted(id));
      dispatch(notifications.success('Email deleted'));
    } catch (err) {
      dispatch(notifications.danger('Could not delete email'));
      dispatch(emailServerError(err));
    }
  })();
};

export const getEmails = (state, campaigns = {}) => {
  const { sort: { sortFunc }, filter: { name = '', campaignId = '' } } = state;
  return Object.keys(state.list)
    .map((id) => {
      const email = state.list[id];
      const { campaign: cId } = email;
      if (cId) {
        email.campaignDetails = campaigns[cId] || {};
      }
      return email;
    })
    .filter((item) => {
      const nameCriteria = item.name.toLowerCase().includes(name.toLowerCase());
      const campaignCriteria = !campaignId || campaignId === item.campaign;
      return (nameCriteria && campaignCriteria);
    })
    .sort(sortFunc);
};
