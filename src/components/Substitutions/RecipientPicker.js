import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class CampaignRecipientPicker extends Component {

  onSelect(option) {
    const { onSelect } = this.props;
    onSelect(option && option.value);
  }

  display(data = {}) {
    if (data.email) return data.email;
    if (data.Email_Address) return data.Email_Address;
    const [field] = Object.keys(data);
    return data[field];
  }

  render() {
    const { list, value } = this.props;
    const options = list
      .map((recipient, index) => ({
        label: this.display(recipient),
        value: index
      }));
    return (
      <Select
        name="recipient-picker"
        placeholder={`Select a recipient.. (${list.length})`}
        value={value}
        options={options}
        valueRenderer={(option) => this.display(option)}
        onChange={(option) => this.onSelect(option)}
        autosize={false}
        {...this.props}
      />
    );
  }
}

export default CampaignRecipientPicker;
