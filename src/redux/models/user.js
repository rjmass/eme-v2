import { Schema, arrayOf } from 'normalizr';

const userSchema = new Schema('users', {
  idAttribute: user => user._id
});

const Schemas = {
  USER: userSchema,
  USER_ARRAY: arrayOf(userSchema)
};

export default Schemas;
