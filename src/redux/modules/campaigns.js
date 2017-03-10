import omit from 'lodash/omit';
import { fetcher } from 'helpers/fetcher';
import { logout } from './auth';
import { notifications } from './notifications';
import Schemas from 'redux/models/campaign';
import config from 'config';

export const CAMPAIGNS_LOAD = 'meme/campaigns/CAMPAIGNS_LOAD';
export const CAMPAIGNS_LOADED = 'meme/campaigns/CAMPAIGNS_LOADED';
export const CAMPAIGN_LOAD = 'meme/campaigns/CAMPAIGN_LOAD';
export const CAMPAIGN_LOADED = 'meme/campaigns/CAMPAIGN_LOADED';
export const CAMPAIGN_UPDATED = 'meme/campaigns/CAMPAIGN_UPDATED';
export const CAMPAIGN_VALIDATION_ERROR = 'meme/campaigns/CAMPAIGN_VALIDATION_ERROR';
export const CAMPAIGN_SERVER_ERROR = 'meme/campaigns/CAMPAIGN_SERVER_ERROR';
export const CAMPAIGN_DELETED = 'meme/campaigns/CAMPAIGN_DELETED';
export const CAMPAIGNS_SORT = 'meme/campaigns/CAMPAIGNS_SORT';
export const CAMPAIGNS_FILTER = 'meme/campaigns/CAMPAIGNS_FILTER';

export const initialState = {
  listLoading: false,
  campaignLoading: false,
  error: null, /* typeof Error */
  list: { },
  filter: { name: '' },
  sort: {
    dir: 'DESC',
    key: 'updated',
    sortFunc: (a, b) => (b.updatedAt).localeCompare(a.updatedAt, undefined, { numeric: true })
  },
};

function generateFetchOptions(method, body) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}

export default function reducer(state = initialState, action = { }) {
  switch (action.type) {
    case CAMPAIGN_LOAD: {
      return { ...state, campaignLoading: true };
    }
    case CAMPAIGNS_LOAD: {
      return { ...state, listLoading: true };
    }
    case CAMPAIGN_LOADED: {
      return { ...state,
        list: { ...state.list, [action.campaign._id]: action.campaign },
        error: null,
        campaignLoading: false
      };
    }
    case CAMPAIGNS_LOADED: {
      return { ...state,
        list: action.campaigns,
        error: null,
        listLoading: false };
    }
    case CAMPAIGN_UPDATED: {
      return {
        ...state,
        list: { ...state.list, [action.campaign._id]: action.campaign },
        error: null,
        campaignLoading: false
      };
    }
    case CAMPAIGNS_FILTER: {
      const filter = { ...state.filter, ...action.filter };
      return { ...state, filter };
    }
    case CAMPAIGNS_SORT: {
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
    case CAMPAIGN_VALIDATION_ERROR:
    case CAMPAIGN_SERVER_ERROR: {
      return { ...state, error: action.error };
    }
    case CAMPAIGN_DELETED: {
      return { ...state,
        list: omit(state.list, action.id),
        error: null
      };
    }
    default:
      return state;
  }
}

export const campaignLoad = () => {
  const type = CAMPAIGN_LOAD;
  return { type };
};

export const campaignServerError = (error = null) => {
  if (error.status === 401) { return logout(); }
  const type = CAMPAIGN_SERVER_ERROR;
  return { type, error };
};

export const campaignsFilter = (filter = { }) => {
  const type = CAMPAIGNS_FILTER;
  return { type, filter };
};

export const campaignsSort = (sortObj) => {
  const type = CAMPAIGNS_SORT;
  return { type, sortObj };
};

export const campaignValidationError = (error = null) => {
  const type = CAMPAIGN_VALIDATION_ERROR;
  return { type, error };
};

export const campaignsLoad = () => {
  const type = CAMPAIGNS_LOAD;
  return { type };
};

export const campaignsLoaded = (campaigns = {}) => {
  const type = CAMPAIGNS_LOADED;
  return { type, campaigns };
};

export const campaignUpdated = (campaign = {}) => {
  const type = CAMPAIGN_UPDATED;
  return { type, campaign };
};

export const campaignLoaded = (campaign = {}) => {
  const type = CAMPAIGN_LOADED;
  return { type, campaign };
};

export const campaignDeleted = (id) => {
  const type = CAMPAIGN_DELETED;
  return { type, id };
};

export const campaignDeleteThunk = (id) => (dispatch) => {
  const options = {
    method: 'DELETE',
  };

  return (async () => {
    try {
      await fetcher(`${config.baseUrl}/campaigns/${id}`, Schemas.CAMPAIGN, options);
      await dispatch(campaignDeleted(id));
      dispatch(notifications.success('Campaign deleted'));
    } catch (err) {
      dispatch(notifications.danger('Could not delete campaign'));
    }
  })();
};

export const campaignCreateThunk = (campaign) => (dispatch) => {
  const options = generateFetchOptions('POST', campaign);

  return (async () => {
    let newCampaign;
    try {
      const resCampaign = await fetcher(`${config.baseUrl}/campaigns`, Schemas.CAMPAIGN, options);
      const [id] = Object.keys(resCampaign.entities.campaigns);
      newCampaign = resCampaign.entities.campaigns[id];
      dispatch(campaignLoaded(newCampaign));
      await dispatch(notifications.success(`Campaign created: ${newCampaign.name}`));
    } catch (err) {
      dispatch(notifications.danger('Could not create new campaign'));
    }
    return newCampaign;
  })();
};

export const campaignCloneThunk = (id) => (dispatch) => {
  return (async () => {
    let resCampaign;
    try {
      const sourceCampaignRes = await fetcher(`${config.baseUrl}/campaigns/${id}`,
        Schemas.CAMPAIGN);
      const sourceCampaign = omit(sourceCampaignRes.entities.campaigns[id], '_id');
      sourceCampaign.name = `Copy of ${sourceCampaign.name}`;
      return await dispatch(campaignCreateThunk(sourceCampaign));
    } catch (err) {
      dispatch(notifications.danger('Could not clone campaign'));
    }
    return resCampaign;
  })();
};

export const campaignUpdateThunk = (id, campaign) => (dispatch) => {
  const options = generateFetchOptions('PATCH', campaign);

  return (async () => {
    let updatedCampaign;
    try {
      const campaignRes = await fetcher(`${config.baseUrl}/campaigns/${id}`,
        Schemas.CAMPAIGN, options);
      updatedCampaign = campaignRes.entities.campaigns[id];
      dispatch(campaignLoaded(updatedCampaign));
      await dispatch(notifications.success('Campaign updated'));
    } catch (err) {
      dispatch(notifications.danger('Could not update campaign'));
    }
    return updatedCampaign;
  })();
};

export const campaignsLoadThunk = () => (dispatch) => {
  dispatch(campaignsLoad());
  return (async () => {
    let campaigns;
    try {
      const campaignsRes = await fetcher(`${config.baseUrl}/campaigns`, Schemas.CAMPAIGN_ARRAY);
      campaigns = campaignsRes.entities.campaigns;
      dispatch(campaignsLoaded(campaigns));
    } catch (error) {
      dispatch(notifications.danger('Could not load campaigns'));
      dispatch(campaignServerError(error));
    }
    return campaigns;
  })();
};

export const campaignLoadThunk = (id) => (dispatch) => {
  return (async () => {
    let campaign;
    try {
      dispatch(campaignLoad());
      const campaignRes = await fetcher(`${config.baseUrl}/campaigns/${id}`, Schemas.CAMPAIGN);
      campaign = campaignRes.entities.campaigns[id];
      dispatch(campaignLoaded(campaign));
    } catch (err) {
      dispatch(notifications.danger('Could not load campaign'));
      dispatch(campaignServerError(err));
    }
    return campaign;
  })();
};

export const getCampaigns = (state, activeOnly = false) => {
  const { sort: { sortFunc }, filter: { name = '' } } = state;

  return Object.keys(state.list)
    .map(_id => state.list[_id])
    .filter((item) => {
      return item.name.toLowerCase().includes(name.toLowerCase())
        && (!activeOnly || !item.archived);
    })
    .sort(sortFunc);
};
