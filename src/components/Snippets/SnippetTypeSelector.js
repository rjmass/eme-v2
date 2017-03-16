import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getSnippets, snippetsLoadThunk } from 'redux/modules/snippets';
import { createSelector } from 'reselect';
import 'react-select/dist/react-select.css';
import './SnippetPicker.css';

class SnippetTypeSelector extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(snippetsLoadThunk());
  }

  render() {
    const { onSelect, list, value } = this.props;
    const options = list
      .map((snippet) => ({
        label: snippet.name,
        value: snippet
      }));
    return (
      <Select
        name="snippet-type-selector"
        placeholder={`Select a snippet type.. (${options.length})`}
        value={value}
        options={options}
        valueRenderer={(option) => option.name}
        onChange={(option) => onSelect(option && option.value)}
        autosize={false}
      />
    );
  }
}

const snippets = state => state.snippets;
const list = createSelector(snippets, () => '', getSnippets);

@connect((state) => ({ list: list(state) }))
export default class SnippetTypeSelectorConnected extends SnippetTypeSelector { }
