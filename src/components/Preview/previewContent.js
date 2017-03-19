import template from 'lodash/template';
import he from 'he';

import emptyPlaceholderTemplate from './templates/placeholder.html';
import replacementContainerTemplate from './templates/replacement.html';

const emptyPlaceholder = template(emptyPlaceholderTemplate);
const replacementContainer = template(replacementContainerTemplate);

const defaultContentExtractor = (htmlFields, fieldName) => {
  const htmlField = htmlFields[fieldName] || {};
  return htmlField.htmlBody;
};

export const createWrapper = htmlBody => {
  const wrapper = document.createElement('div');
  // this class is for 'arrive' to identify preview
  wrapper.className = 'html-preview';
  wrapper.innerHTML = htmlBody;
  return wrapper;
};

export const replaceCustomTags = (htmlBody = '', htmlFields = {},
  contentExtractor = defaultContentExtractor) => {
  const wrapper = createWrapper(htmlBody);

  // replace custom content tags
  const contentElements = wrapper.querySelectorAll('content');
  for (const contentElement of contentElements) {
    const name = contentElement.getAttribute('name');
    const content = contentExtractor(htmlFields, name);
    if (content) {
      const container = document.createElement('div');
      container.innerHTML = content;
      const decodedContent = he.decode(container.innerHTML);
      contentElement.textContent = replacementContainer({ name, content: decodedContent });
    } else {
      contentElement.textContent = emptyPlaceholder({ name });
    }
  }
  return he.decode(wrapper.outerHTML);
};
