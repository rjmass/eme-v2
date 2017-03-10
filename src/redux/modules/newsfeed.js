import { fetcher } from 'helpers/fetcher';
import Schemas from 'redux/models/article';
import { notifications } from './notifications';
import config from 'config';

const NEWSFEED_QUERY = 'meme/newsfeed/NEWSFEED_LOAD';
const NEWSFEED_LOADED = 'meme/newsfeed/NEWSFEED_LOADED';
const NEWSFEED_ITEM_TOGGLE_SELECT = 'meme/newsfeed/NEWSFEED_ITEM_SELECT';
const NEWSFEED_ITEM_SELECT_ALL = 'meme/newsfeed/NEWSFEED_ITEM_SELECT_ALL';
const NEWSFEED_ITEM_SELECT_NONE = 'meme/newsfeed/NEWSFEED_ITEM_SELECT_NONE';
const NEWSFEED_SERVER_ERROR = 'meme/newsfeed/newfeed_SERVER_ERROR';

const initialState = {
  loading: false,
  list: { },
  error: null, /* typeof Error */
};

export const getArticles = (state, selectedOnly = false) => {
  const articles = Object.keys(state.list)
    .map((id) => state.list[id]);

  if (selectedOnly) {
    return articles.filter(a => a.selected);
  }

  return articles;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NEWSFEED_QUERY: {
      return {
        ...state,
        loading: true,
        list: { }
      };
    }
    case NEWSFEED_LOADED: {
      return {
        ...state,
        loading: false,
        list: action.list
      };
    }
    case NEWSFEED_SERVER_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.error
      };
    }

    case NEWSFEED_ITEM_TOGGLE_SELECT: {
      const id = action.id;
      const article = state.list[id];
      article.selected = !article.selected;
      return {
        ...state,
        list: { ...state.list, [id]: article }
      };
    }

    case NEWSFEED_ITEM_SELECT_ALL: {
      const list = getArticles(state)
        .map((article) => ({ ...article, selected: true }))
        .reduce((acc, article) => ({ ...acc, [article.id]: article }), {});
      return {
        ...state,
        list
      };
    }

    case NEWSFEED_ITEM_SELECT_NONE: {
      const list = getArticles(state)
        .map(article => ({ ...article, selected: false }))
        .reduce((acc, article) => ({ ...acc, [article.id]: article }), {});
      return {
        ...state,
        list
      };
    }

    default:
      return state;
  }
};

export const articlesQuery = () => {
  return { type: NEWSFEED_QUERY };
};

export const articlesLoaded = (list = {}) => {
  return {
    type: NEWSFEED_LOADED,
    list
  };
};

export const articlesServerError = (error) => {
  return {
    type: NEWSFEED_SERVER_ERROR,
    error
  };
};

export const articlesToggleSelection = (id) => {
  return {
    type: NEWSFEED_ITEM_TOGGLE_SELECT,
    id
  };
};

export const articlesSelectNone = () => {
  return { type: NEWSFEED_ITEM_SELECT_NONE };
};

export const articlesSelectAll = () => {
  return { type: NEWSFEED_ITEM_SELECT_ALL };
};

export const articlesQueryThunk = (query, limit = '1DAY') => (dispatch) => {
  return (async () => {
    dispatch(articlesQuery());
    try {
      query = encodeURIComponent(query);
      const resArticles =
        await fetcher(`${config.baseUrl}/news?q=${query}&limit=${limit}`, Schemas.ARTICLE_ARRAY);
      const articles = resArticles.entities.articles;
      dispatch(articlesLoaded(articles));
      dispatch(articlesSelectAll());
    } catch (error) {
      dispatch(notifications.danger('Could not load articles'));
      dispatch(articlesServerError(error));
    }
  })();
};
