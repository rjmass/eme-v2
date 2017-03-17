import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getSnippets, snippetsLoadThunk } from 'redux/modules/snippets';
import { createSelector } from 'reselect';
import 'react-select/dist/react-select.css';
import './SnippetPicker.css';

class SnippetPicker extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(snippetsLoadThunk());
  }

  render() {
    const { onSelect, list, html = true, value } = this.props;
    const filter = s => { return !s.isTemplate && (html ? s.isHtml : !s.isHtml); };
    const options = list
      .filter(filter)
      .map((snippet) => ({
        label: snippet.name,
        value: snippet
      }));
    return (
      <Select
        name="snippet-picker"
        placeholder={`Select a snippet.. (${options.length})`}
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
export default class SnippetPickerConnected extends SnippetPicker { }
