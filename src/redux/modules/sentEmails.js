import { createSelector } from 'reselect';
import { fetcher } from 'helpers/fetcher';
import { notifications } from './notifications';
import { logout } from './auth';
import { getKeenClient, formatQuery } from 'helpers/keenQueryBuilder';
import Schemas from 'redux/models/sentEmail';
import config from 'config';
import omit from 'lodash/omit';

export const SENT_EMAILS_LOAD = 'meme/analytics/emails/SENT_EMAILS_LOAD';
export const SENT_EMAILS_LOADED = 'meme/analytics/emails/SENT_EMAILS_LOADED';
export const SENT_EMAIL_LOAD = 'meme/analytics/emails/SENT_EMAIL_LOAD';
export const SENT_EMAIL_LOADED = 'meme/analytics/emails/SENT_EMAIL_LOADED';
export const SENT_EMAIL_SERVER_ERROR = 'meme/analytics/emails/SENT_EMAIL_SERVER_ERROR';
export const SENT_EMAIL_VALIDATION_ERROR = 'meme/analytics/email/SENT_EMAIL_VALIDATION_ERROR';
export const SENT_EMAIL_ACTION_DETAILS_LOAD = 'meme/analytics/email/SENT_EMAIL_ACTION_DETAILS_LOAD';
export const SENT_EMAIL_ACTION_DETAILS_LOADED =
  'meme/analytics/email/SENT_EMAIL_ACTION_DETAILS_LOADED';
export const SENT_EMAIL_DELETE = 'meme/emails/sent/SENT_EMAIL_DELETE';
export const SENT_EMAIL_DELETED = 'meme/emails/sent/SENT_EMAIL_DELETED';

export const initialState = {
  listLoading: false,
  sentEmailLoading: false,
  sentEmailActionDetailsLoading: false,
  list: { },
  listActions: { },
  error: null /* typeof Error */
};

export function getOrderedHtmlFields(email) {
  const { htmlFields = {} } = email;
  return Object.keys(htmlFields)
    .map((key) => {
      const field = htmlFields[key];
      return { ...field, key };
    })
    .sort((f1, f2) => f1.index - f2.index);
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SENT_EMAILS_LOAD: {
      return { ...state, listLoading: true };
    }
    case SENT_EMAIL_LOAD: {
      return { ...state, sentEmailLoading: true };
    }
    case SENT_EMAIL_ACTION_DETAILS_LOAD: {
      return { ...state, sentEmailActionDetailsLoading: true };
    }
    case SENT_EMAILS_LOADED: {
      return {
        ...state,
        error: null,
        list: action.emails,
        listLoading: false
      };
    }
    case SENT_EMAIL_LOADED: {
      return {
        ...state,
        list: { ...state.list, [action.email.emailId]: action.email },
        error: null,
        sentEmailLoading: false,
      };
    }
    case SENT_EMAIL_ACTION_DETAILS_LOADED: {
      const recipientEmails = action.recipients.reduce((acc, recipient) => {
        const matched = action.substitution[recipient];
        if (matched) {
          acc.push(matched.email);
        }
        return acc;
      }, []);

      const updatedEmail = { ...state.listActions[action.id], [action.action]: recipientEmails };
      return {
        ...state,
        listActions: { ...state.listActions, [action.id]: updatedEmail },
        error: null,
        sentEmailActionDetailsLoading: false
      };
    }
    case SENT_EMAIL_VALIDATION_ERROR:
    case SENT_EMAIL_SERVER_ERROR: {
      return { ...state, error: action.error };
    }
    case SENT_EMAIL_DELETED: {
      return { ...state,
        list: omit(state.list, action.id),
        error: null
      };
    }
    default: {
      return state;
    }
  }
}

export function sentEmailValidationError(error = null) {
  const type = SENT_EMAIL_VALIDATION_ERROR;
  return { type, error };
}

export function sentEmailServerError(err = null) {
  if (err.status === 401) { return logout(); }
  return { type: SENT_EMAIL_SERVER_ERROR, err };
}

export function sentEmailsLoad() {
  return { type: SENT_EMAILS_LOAD };
}

export function sentEmailLoad() {
  return { type: SENT_EMAIL_LOAD };
}

export function sentEmailActionDetailsLoad() {
  return { type: SENT_EMAIL_ACTION_DETAILS_LOAD };
}

export function sentEmailsLoaded(emails = {}) {
  return { type: SENT_EMAILS_LOADED, emails };
}

export function sentEmailLoaded(email = {}) {
  return { type: SENT_EMAIL_LOADED, email };
}

export function sentEmailActionDetailsLoaded(id, action, recipients = [], substitution = {}) {
  return { type: SENT_EMAIL_ACTION_DETAILS_LOADED, id, action, recipients, substitution };
}

export function sentEmailDeleted(id) {
  return { type: SENT_EMAIL_DELETED, id };
}

export const sentEmailsLoadThunk = () => (dispatch) => {
  dispatch(sentEmailsLoad());
  return (async () => {
    let emails;
    try {
      const emailsRes = await fetcher(`${config.baseUrl}/emails/sent?past`,
        Schemas.SENT_EMAIL_ARRAY);
      emails = emailsRes.entities.sentEmails;
      dispatch(sentEmailsLoaded(emails));
    } catch (err) {
      dispatch(notifications.danger('Could not load sent emails'));
      dispatch(sentEmailServerError(err));
    }
    return emails;
  })();
};

export const sentEmailLoadThunk = (id) => (dispatch) => {
  dispatch(sentEmailLoad());
  return (async () => {
    let email;
    try {
      const emailRes = await fetcher(`${config.baseUrl}/emails/sent/${id}`, Schemas.SENT_EMAIL);
      email = emailRes.entities.sentEmails[id];
      dispatch(sentEmailLoaded(email));
    } catch (err) {
      dispatch(notifications.danger('Could not load analytics'));
      dispatch(sentEmailServerError(err));
    }
    return email;
  })();
};

export const sentEmailSubstitutionLoadThunk = (id) => (dispatch) => {
  return (async () => {
    let substitution;
    try {
      return await fetcher(`${config.baseUrl}/savedEmails/${id}`);
    } catch (err) {
      dispatch(notifications.danger('Could not load analytics'));
      dispatch(sentEmailServerError(err));
    }
    return substitution;
  })();
};

export const sentEmailLoadActionDetailsThunk = (id, action) => (dispatch) => {
  dispatch(sentEmailActionDetailsLoad());
  return (async () => {
    const email = await dispatch(sentEmailLoadThunk(id));
    const substitution = await dispatch(sentEmailSubstitutionLoadThunk(email.substitution));
    const res = await getKeenClient().send(formatQuery(id, action, email.sentDate, new Date()));
    const recipients = res.result;
    dispatch(sentEmailActionDetailsLoaded(id, action, recipients, substitution));
  })();
};

export const emailDeleteThunk = (id) => (dispatch) => {
  const options = {
    method: 'DELETE',
  };

  return (async () => {
    try {
      dispatch({ type: SENT_EMAIL_DELETE });
      await fetcher(`${config.baseUrl}/emails/sent/${id}`, Schemas.SENT_EMAIL, options);
      await dispatch(sentEmailDeleted(id));
      dispatch(notifications.success('Email deleted'));
    } catch (err) {
      dispatch(notifications.danger('Could not delete email'));
      dispatch(sentEmailServerError(err));
    }
  })();
};

const listSelector = state => state.list;
export const getSentEmails = createSelector(
  [listSelector], list => {
    return Object.keys(list)
      .map(_id => list[_id])
      .sort((item1, item2) => item2.sentDate.localeCompare(item1.sentDate));
  });
