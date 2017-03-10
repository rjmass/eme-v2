import { fetcher } from '../../helpers/fetcher';
import { notifications } from './notifications';
import config from 'config';
import { scheduledEmailsLoadThunk } from './scheduledEmails';
import { sentEmailsLoadThunk } from './sentEmails';

const SEND_LOADED = 'meme/send/SEND_LOADED';
const SEND_REMOVED = 'meme/send/SEND_REMOVED';
const SEND_CONFIRM_LOAD = 'meme/send/SEND_CONFIRM_LOAD';
const SEND_CONFIRM_LOADED = 'meme/send/SEND_CONFIRM_LOADED';

const initialState = {
  listId: null,
  startTime: 'now',
  isSending: false,
  error: null /* typeof Error */
};

function generateFetchOptions(method, body) {
  return {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SEND_LOADED: {
      return { ...state, isSending: true, listId: action.listId, startTime: action.startTime };
    }
    case SEND_REMOVED: {
      return { ...state, isSending: false, listId: null, startTime: 'now' };
    }
    case SEND_CONFIRM_LOAD: {
      return { ...state, isSending: true };
    }
    case SEND_CONFIRM_LOADED: {
      return { ...state, isSending: false };
    }
    default: {
      return state;
    }
  }
}

export function sendLoaded(listId, startTime) {
  return { type: SEND_LOADED, listId, startTime };
}

export function sendRemoved() {
  return { type: SEND_REMOVED };
}

export function sendConfirmLoad() {
  return { type: SEND_CONFIRM_LOAD };
}

export function sendConfirmLoaded() {
  return { type: SEND_CONFIRM_LOADED };
}

export const sendThunk = (body, query = '') => dispatch => {
  const options = generateFetchOptions('POST', body);
  return (async () => {
    try {
      await fetcher(`${config.baseUrl}/send/by-address${query}`, null, options);
      dispatch(sendRemoved());
      dispatch(notifications.success('Email scheduled for delivery'));
      dispatch(sendConfirmLoaded());
      dispatch(scheduledEmailsLoadThunk());
      dispatch(sentEmailsLoadThunk());
    } catch (err) {
      dispatch(sendRemoved());
      dispatch(notifications.danger(`Email Issue: ${err.message}`));
    }
  })();
};

export const sendListThunk = (body) => dispatch => {
  const options = generateFetchOptions('POST', body);
  return (async () => {
    try {
      await fetcher(`${config.baseUrl}/send/by-list`, null, options);
      dispatch(sendRemoved());
      dispatch(notifications.success('Email scheduled for delivery'));
      dispatch(sendConfirmLoaded());
      dispatch(scheduledEmailsLoadThunk());
      dispatch(sentEmailsLoadThunk());
    } catch (err) {
      dispatch(sendRemoved());
      dispatch(notifications.danger(`Email Issue: ${err.message}`));
    }
  })();
};

export const sendEmailPreviewThunk = (id, recipients, listId = null) => dispatch => {
  dispatch(sendConfirmLoad());
  const query = listId ? '?mixed=true&preview=true' : '?preview=true';
  return (async () => {
    const body = { id, recipients, substitutionId: listId };
    await dispatch(sendThunk(body, query));
  })();
};
