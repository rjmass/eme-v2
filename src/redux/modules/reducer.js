import { reducer as reduxAsyncConnect } from 'redux-async-connect';
import { reducer as notifReducer } from 'redux-notifications';
import { routerReducer } from 'react-router-redux';
import scheduledEmails from './scheduledEmails';
import { reducer as form } from 'redux-form';
import substitutions from './substitutions';
import { combineReducers } from 'redux';
import sentEmails from './sentEmails';
import templates from './templates';
import campaigns from './campaigns';
import snippets from './snippets';
import newsfeed from './newsfeed';
import queries from './queries';
import emails from './emails';
import images from './images';
import users from './users';
import send from './send';
import auth from './auth';

export default combineReducers({
  routing: routerReducer,
  notifs: notifReducer,
  reduxAsyncConnect,
  scheduledEmails,
  substitutions,
  sentEmails,
  templates,
  campaigns,
  snippets,
  newsfeed,
  queries,
  emails,
  images,
  users,
  send,
  auth,
  form,
});
