import { Schema, arrayOf } from 'normalizr';

const imageSchema = new Schema('image', {
  idAttribute: image => image.Key
});

const Schemas = {
  IMAGE: imageSchema,
  IMAGES_ARRAY: arrayOf(imageSchema)
};

export default Schemas;
