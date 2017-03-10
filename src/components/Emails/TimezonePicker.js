import React, { Component } from 'react';
import Select from 'react-select';
import timezones from './timezones.json';

const options = Object.keys(timezones).map((key) => ({
  label: key,
  value: timezones[key]
}));

class TimezonePicker extends Component {
  render() {
    const { onSelect, value } = this.props;

    return (
      <Select
        name="timezone-picker"
        placeholder={`Select a timezone.. (${options.length})`}
        value={value}
        options={options}
        onChange={(option) => onSelect(option && option.value)}
        autosize={false}
      />
    );
  }
}

export default TimezonePicker;
