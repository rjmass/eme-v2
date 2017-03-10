import { fetcher } from 'helpers/fetcher';
import { logout } from './auth';
import { notifications } from './notifications';
import Schemas from 'redux/models/scheduledEmail';
import { createSelector } from 'reselect';
import config from 'config';
import omit from 'lodash/omit';

export const SCHEDULED_EMAILS_LOAD = 'meme/analytics/emails/SCHEDULED_EMAILS_LOAD';
export const SCHEDULED_EMAILS_LOADED = 'meme/analytics/emails/SCHEDULED_EMAILS_LOADED';
export const SCHEDULED_EMAIL_SERVER_ERROR = 'meme/analytics/emails/SCHEDULED_EMAIL_SERVER_ERROR';
export const SCHEDULED_EMAIL_DELETED = 'meme/analytics/emails/SCHEDULED_EMAIL_DELETED';

export const initialState = {
  listLoading: false,
  list: { },
  error: null /* typeof Error */
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SCHEDULED_EMAILS_LOAD: {
      return { ...state, listLoading: true };
    }
    case SCHEDULED_EMAILS_LOADED: {
      return {
        ...state,
        error: null,
        list: action.emails,
        listLoading: false
      };
    }
    case SCHEDULED_EMAIL_SERVER_ERROR: {
      return { ...state, error: action.error };
    }
    case SCHEDULED_EMAIL_DELETED: {
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

export function scheduledEmailServerError(err = null) {
  if (err.status === 401) { return logout(); }
  return { type: SCHEDULED_EMAIL_SERVER_ERROR, err };
}

export function scheduledEmailsLoad() {
  return { type: SCHEDULED_EMAILS_LOAD };
}

export function scheduledEmailsLoaded(emails = {}) {
  return { type: SCHEDULED_EMAILS_LOADED, emails };
}

export function scheduledEmailDeleted(id) {
  return { type: SCHEDULED_EMAIL_DELETED, id };
}

export const scheduledEmailsLoadThunk = () => (dispatch) => {
  dispatch(scheduledEmailsLoad());
  return (async () => {
    let emails;
    try {
      const emailsRes = await fetcher(`${config.baseUrl}/emails/scheduled?state=submitted`,
        { results: Schemas.SCHEDULED_EMAIL_ARRAY });
      emails = emailsRes.entities.scheduledEmails;
      dispatch(scheduledEmailsLoaded(emails));
    } catch (err) {
      dispatch(notifications.danger('Could not load scheduled emails'));
      dispatch(scheduledEmailServerError(err));
    }
    return emails;
  })();
};

export const scheduledEmailDeleteThunk = (id) => (dispatch) => {
  const options = {
    method: 'DELETE',
  };

  return (async () => {
    try {
      await fetcher(`${config.baseUrl}/emails/scheduled/${id}`, null, options);
      await dispatch(scheduledEmailDeleted(id));
      dispatch(notifications.success('Scheduled send cancelled'));
    } catch (err) {
      dispatch(notifications.danger('Could not cancel scheduled send'));
    }
  })();
};

const listSelector = state => state.list;
export const getScheduledEmails = createSelector(
  [listSelector], list => {
    return Object.keys(list)
      .map(id => list[id])
      .sort((item1, item2) => {
        return item2.start_time.localeCompare(item1.start_time);
      });
  });
