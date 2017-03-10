import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getTemplates, templatesLoadThunk } from 'redux/modules/templates';
import 'react-select/dist/react-select.css';

@connect((state) => ({ list: getTemplates(state.templates) }))
class TemplatePicker extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(templatesLoadThunk());
  }

  render() {
    const { onSelect, list, value } = this.props;
    const options = list
      .map((template) => ({
        label: template.name,
        value: template._id
      }));
    return (
      <Select
        name="template-picker"
        placeholder={`Select a template.. (${options.length})`}
        value={value}
        options={options}
        onChange={(option) => onSelect(option && option.value)}
        autosize={false}
        {...this.props}
      />
    );
  }
}

export default TemplatePicker;
