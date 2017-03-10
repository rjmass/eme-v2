import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getSubstitutions, substitutionsLoadThunk } from 'redux/modules/substitutions';
import 'react-select/dist/react-select.css';

@connect((state) => ({ list: getSubstitutions(state.substitutions) }))
class ListPicker extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(substitutionsLoadThunk());
  }

  render() {
    const { onSelect, list, value } = this.props;
    const options = list
      .map((item) => ({
        label: item.name,
        value: item._id
      }));
    return (
      <Select
        name="list-picker"
        placeholder={`Select a list.. (${options.length})`}
        value={value}
        options={options}
        onChange={(option) => onSelect(option && option.value)}
        autosize={false}
        {...this.props}
      />
    );
  }
}

export default ListPicker;
