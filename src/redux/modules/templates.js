import { fetcher } from 'helpers/fetcher';
import { logout } from './auth';
import { notifications } from './notifications';
import omit from 'lodash/omit';
import Schemas from 'redux/models/template';
import config from 'config';

export const TEMPLATES_LOAD = 'meme/templates/TEMPLATES_LOAD';
export const TEMPLATES_LOADED = 'meme/templates/TEMPLATES_LOADED';
export const TEMPLATE_LOAD = 'meme/templates/TEMPLATE_LOAD';
export const TEMPLATE_LOADED = 'meme/templates/TEMPLATE_LOADED';
export const TEMPLATE_VALIDATION_ERROR = 'meme/templates/TEMPLATE_VALIDATION_ERROR';
export const TEMPLATE_SERVER_ERROR = 'meme/templates/TEMPLATE_SERVER_ERROR';
export const TEMPLATE_DELETED = 'meme/templates/TEMPLATE_DELETED';
export const TEMPLATES_FILTER = 'meme/templates/TEMPLATE_FILTER';
export const TEMPLATES_SORT = 'meme/templates/TEMPLATES_SORT';

const headers = { 'Content-Type': 'application/json' };

export const initialState = {
  listLoading: false,
  templateLoading: false,
  list: { },
  filter: { name: '' },
  sort: {
    dir: 'DESC',
    key: 'updated',
    sortFunc: (a, b) => (b.updatedAt).localeCompare(a.updatedAt, undefined, { numeric: true })
  },
  error: null /* typeof Error */
};


export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TEMPLATES_LOAD: {
      return { ...state, listLoading: true };
    }
    case TEMPLATES_LOADED: {
      return { ...state,
        list: action.templates,
        error: null,
        listLoading: false };
    }
    case TEMPLATE_LOADED: {
      return { ...state,
        list: { ...state.list, [action.template._id]: action.template },
        error: null,
        templateLoading: false };
    }
    case TEMPLATE_LOAD: {
      return { ...state, templateLoading: true };
    }
    case TEMPLATES_FILTER: {
      const filter = { ...state.filter, ...action.filter };
      return { ...state, filter };
    }
    case TEMPLATES_SORT: {
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
    case TEMPLATE_VALIDATION_ERROR:
    case TEMPLATE_SERVER_ERROR: {
      return { ...state, error: action.error };
    }
    case TEMPLATE_DELETED: {
      return { ...state,
        list: omit(state.list, action.id),
        error: null
      };
    }
    default: return state;
  }
}

export const templateServerError = (error = null) => {
  if (error.status === 401) { return logout(); }
  const type = TEMPLATE_SERVER_ERROR;
  return { type, error };
};

export const templatesFilter = (filter = { }) => {
  const type = TEMPLATES_FILTER;
  return { type, filter };
};

export const templatesSort = (sortObj) => {
  const type = TEMPLATES_SORT;
  return { type, sortObj };
};

export const templateValidationError = (error = null) => {
  const type = TEMPLATE_VALIDATION_ERROR;
  return { type, error };
};

export const templatesLoad = () => {
  const type = TEMPLATES_LOAD;
  return { type };
};

export const templatesLoaded = (templates = {}) => {
  const type = TEMPLATES_LOADED;
  return { type, templates };
};

export const templateLoad = () => {
  const type = TEMPLATE_LOAD;
  return { type };
};

export const templateLoaded = (template = {}) => {
  const type = TEMPLATE_LOADED;
  return { type, template };
};

export const templateDeleted = (id) => {
  const type = TEMPLATE_DELETED;
  return { type, id };
};

export const templateDeleteThunk = (id) => (dispatch) => {
  const options = {
    method: 'DELETE',
  };

  return (async () => {
    try {
      await fetcher(`${config.baseUrl}/templates/${id}`, Schemas.TEMPLATE, options);
      await dispatch(templateDeleted(id));
      dispatch(notifications.success('Template deleted'));
    } catch (err) {
      dispatch(notifications.danger('Could not delete template'));
    }
  })();
};

export const templateCreateThunk = (template) => (dispatch) => {
  const body = JSON.stringify(template);
  const options = {
    headers,
    method: 'POST',
    body
  };

  return (async () => {
    let newTemplate;
    try {
      const resTemplate = await fetcher(`${config.baseUrl}/templates`, Schemas.TEMPLATE, options);
      const [id] = Object.keys(resTemplate.entities.templates);
      newTemplate = resTemplate.entities.templates[id];
      dispatch(templateLoaded(newTemplate));
      await dispatch(notifications.success(`Template created: ${newTemplate.name}`));
    } catch (err) {
      dispatch(notifications.danger('Could not create new template'));
    }
    return newTemplate;
  })();
};

export const templateCloneThunk = (id) => (dispatch) => {
  let clonedTemplate;
  return (async () => {
    try {
      const sourceTemplateRes = await fetcher(`${config.baseUrl}/templates/${id}`,
        Schemas.TEMPLATE);
      const sourceTemplate = omit(sourceTemplateRes.entities.templates[id],
        '_id', 'updatedAt', 'createdAt');
      sourceTemplate.name = `Copy of ${sourceTemplate.name}`;
      clonedTemplate = await dispatch(templateCreateThunk(sourceTemplate));
    } catch (err) {
      dispatch(notifications.danger('Could not clone template'));
    }
    return clonedTemplate;
  })();
};

export const templateUpdateThunk = (id, template) => (dispatch) => {
  const body = JSON.stringify(template);
  const options = {
    headers,
    method: 'PATCH',
    body
  };

  return (async () => {
    let updatedTemplate;
    try {
      const templateRes = await fetcher(`${config.baseUrl}/templates/${id}`,
        Schemas.TEMPLATE, options);
      updatedTemplate = templateRes.entities.templates[id];
      dispatch(templateLoaded(updatedTemplate));
      await dispatch(notifications.success('Template updated'));
    } catch (err) {
      dispatch(notifications.danger('Could not update template'));
    }
    return updatedTemplate;
  })();
};

export const templatesLoadThunk = () => (dispatch) => {
  dispatch(templatesLoad());
  return (async () => {
    let templates;
    try {
      const templatesRes = await fetcher(`${config.baseUrl}/templates`, Schemas.TEMPLATE_ARRAY);
      templates = templatesRes.entities.templates;
      dispatch(templatesLoaded(templates));
    } catch (error) {
      dispatch(notifications.danger('Could not load templates'));
      dispatch(templateServerError(error));
    }
    return templates;
  })();
};

export const templateLoadThunk = (id) => (dispatch) => {
  dispatch(templateLoad());
  return (async () => {
    let template;
    try {
      const templateRes = await fetcher(`${config.baseUrl}/templates/${id}`, Schemas.TEMPLATE);
      template = templateRes.entities.templates[id];
      dispatch(templateLoaded(template));
    } catch (err) {
      dispatch(notifications.danger('Could not load template'));
      dispatch(templateServerError(err));
    }
    return template;
  })();
};

export const getTemplates = (state, campaigns = {}) => {
  const { sort: { sortFunc }, filter: { name = '' } } = state;
  return Object.keys(state.list)
    .map((_id) => {
      const template = state.list[_id];
      const { campaign: cId } = template;
      if (cId) {
        template.campaignDetails = campaigns[cId] || {};
      }
      return template;
    })
    .filter((item) => item.name.toLowerCase().includes(name.toLowerCase()))
    .sort(sortFunc);
};
