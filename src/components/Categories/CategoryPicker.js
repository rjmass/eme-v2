import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import Select from 'react-select';

export const categories = [
  { name: 'Account', domain: 'notice.ft.com' },
  { name: 'Recommendation', domain: 'news-alerts.ft.com' },
  { name: 'Service', domain: 'service.ft.com' },
  { name: 'Marketing', domain: 'marketing.ft.com' }
];

const domainToEmail = (domain) => {
  return domain ? `info@${domain}` : null;
};
const emailToDomain = (email) => {
  if (!email) return null;
  const [, domain] = email.split('@');
  return domain;
};

export default class CategoryPicker extends Component {

  onSelect(option) {
    const { onSelect } = this.props;
    const domain = option && option.value;
    onSelect(domainToEmail(domain));
  }

  render() {
    const { value } = this.props;
    const options = categories
      .map((category) => ({
        label: category.name,
        value: category.domain
      }));
    const domain = emailToDomain(value);

    return (
      <div>
        <FormControl type="hidden" {...this.props} />
        <Select
          placeholder={`Select email category.. (${categories.length})`}
          name="category-picker"
          value={domain}
          options={options}
          onChange={(option) => this.onSelect(option)}
          autosize={false}
        />
      </div>
    );
  }
}
