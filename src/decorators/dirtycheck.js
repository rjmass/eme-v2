import isEqual from 'lodash/isEqual';

const isFormField = (field) => {
  return (typeof field === 'object')
    && !!field._isFieldValue;
};

const isVisitable = (obj) => {
  return (typeof obj === 'object')
    && !isFormField(obj);
};

const isFieldDirty = (field) => {
  return !isEqual(field.initial, field.value);
};

const visit = (form) => {
  const keys = Object.keys(form);
  for (const key of keys) {
    const possibleField = form[key];
    if (isFormField(possibleField)) {
      if (isFieldDirty(possibleField)) {
        return true;
      }
    }
    if (isVisitable(possibleField)) {
      if (visit(possibleField)) {
        return true;
      }
    }
  }
  return false;
};

export default () => {
  return (BaseComponent) => class DirtyCheck extends BaseComponent {
    isFormDirty(form) {
      return visit(form);
    }
  };
};
