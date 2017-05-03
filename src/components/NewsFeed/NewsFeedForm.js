import React, { Component } from 'react';
import { FormGroup } from 'react-bootstrap';
import NewsPicker from './NewsPicker';
import NewsFeedDragContainer from './NewsFeedDragContainer';

export default class NewsFeedForm extends Component {
  render() {
    const { htmlBody, cards, snippet, onChange } = this.props;
    return (
      <div>
        <NewsPicker
          htmlBody={htmlBody}
          cards={cards}
          onInsert={(body, selected, snip) => onChange(body, selected, snip)}
        />
        <FormGroup>
          <NewsFeedDragContainer
            htmlBody={htmlBody}
            cards={cards}
            snippet={snippet}
            onChange={(body, selected, snip) => onChange(body, selected, snip)}
          />
        </FormGroup>
      </div>
    );
  }
}
