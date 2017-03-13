export default (text = '', maxLength) => {
  if (text.length > maxLength) {
    return `${text.substr(0, maxLength)}`;
  }
  return text;
};
