import React, { Component } from 'react';
import { FormGroup } from 'react-bootstrap';
import NewsPicker from './NewsPicker';
import NewsFeedDragContainer from './NewsFeedDragContainer';

export default class NewsFeedForm extends Component {
  render() {
    const { cards, snippet, onChange } = this.props;
    return (
      <div>
        <NewsPicker
          cards={cards}
          snippet={snippet}
          onInsert={(body, selected, snip) => onChange(body, selected, snip)}
        />
        <FormGroup>
          <NewsFeedDragContainer
            cards={cards}
            snippet={snippet}
            onChange={(body, selected, snip) => onChange(body, selected, snip)}
          />
        </FormGroup>
      </div>
    );
  }
}
