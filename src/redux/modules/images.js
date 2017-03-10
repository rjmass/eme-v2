import { fetcher } from '../../helpers/fetcher';
import { notifications } from './notifications';
import Schemas from 'redux/models/image';
import config from 'config';

const IMAGE_UPLOAD = 'meme/images/IMAGE_UPLOAD';
const IMAGE_UPLOADED = 'meme/images/IMAGE_UPLOADED';
const IMAGES_LOAD = 'meme/images/IMAGES_LOAD';
const IMAGES_LOADED = 'meme/images/IMAGES_LOADED';
const IMAGES_FILTER = 'meme/images/IMAGES_FILTER';
const IMAGES_SORT = 'meme/images/IMAGES_SORT';
const IMAGES_SERVER_ERROR = 'meme/images/IMAGES_SERVER_ERROR';

const initialState = {
  filter: { name: '' },
  list: {},
  isUploading: false,
  isLoading: false,
  error: null, /* typeof Error */
  sort: {
    dir: 'ASC',
    key: 'LastModified',
    sortFunc: (a, b) => (b.LastModified || '')
      .localeCompare(a.LastModified || '', undefined, { numeric: true })
  }
};

const generateUploadFetchOptions = (file, name = file.name) => {
  const data = new FormData();
  data.append('image', file);
  data.append('name', name);
  return {
    method: 'POST',
    body: data
  };
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case IMAGE_UPLOAD: {
      return { ...state, isUploading: true };
    }
    case IMAGE_UPLOADED: {
      return { ...state,
        isUploading: false,
        list: { ...state.list, [action.id]: action.image },
        error: null,
      };
    }
    case IMAGES_LOAD: {
      return { ...state, isLoading: true };
    }
    case IMAGES_LOADED: {
      return { ...state,
        isLoading: false,
        list: action.list,
        error: null
      };
    }
    case IMAGES_FILTER: {
      const filter = { ...state.filter, ...action.filter };
      return { ...state, filter };
    }
    case IMAGES_SORT: {
      const sort = { ...state.sort };
      console.log(sort);
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
    case IMAGES_SERVER_ERROR: {
      return { ...state,
        error: action.error,
        isLoading: false,
        isUploading: false
      };
    }
    default: {
      return state;
    }
  }
}

export function imageUpload() {
  return { type: IMAGE_UPLOAD };
}

export function imageUploaded(image, id) {
  return { type: IMAGE_UPLOADED, image, id };
}

export function imagesLoad() {
  return { type: IMAGES_LOAD };
}

export function imagesLoaded(list = { }) {
  return { type: IMAGES_LOADED, list };
}

export function imagesFilter(filter = { }) {
  return { type: IMAGES_FILTER, filter };
}

export function imagesSort(sortObj) {
  const type = IMAGES_SORT;
  return { type, sortObj };
}

export const imageServerError = (error = null) => {
  const type = IMAGES_SERVER_ERROR;
  return { type, error };
};

export const imageUploadThunk = (image, name) => (dispatch) => {
  dispatch(imageUpload());
  return (async () => {
    try {
      const options = generateUploadFetchOptions(image, name);
      const imageRes = await fetcher(`${config.baseUrl}/images`, Schemas.IMAGE, options);
      const { result: id } = imageRes;
      const img = imageRes.entities.image[id];
      dispatch(imageUploaded(img, id));
      dispatch(notifications.success('Image uploaded'));
    } catch (error) {
      dispatch(imageServerError(error));
      dispatch(notifications.danger('Could not upload image'));
    }
  })();
};

export const imagesLoadThunk = () => (dispatch) => {
  return (async () => {
    try {
      dispatch(imagesLoad());
      const imagesRes = await fetcher(`${config.baseUrl}/images`, Schemas.IMAGES_ARRAY);
      dispatch(imagesLoaded(imagesRes.entities.image));
    } catch (err) {
      dispatch(notifications.danger('Could not load images'));
    }
  })();
};

export const getImages = (state, filterOverride = null) => {
  const { sort: { sortFunc } } = state;
  const filter = (filterOverride !== null)
    ? filterOverride
    : state.filter.name;
  return Object.keys(state.list)
    .map((_id) => state.list[_id])
    .filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()))
    .sort(sortFunc);
};
