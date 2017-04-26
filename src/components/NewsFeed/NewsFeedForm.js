import React, { Component } from 'react';
import NewsPicker from './NewsPicker';

export default class NewsFeedForm extends Component {
  render() {
    return (
      <NewsPicker
        onInsert={(snippet) => this.handleOnSnippetSelect(snippet)}
      />
    );
  }
}
