import React, { Component } from 'react';
import { FormGroup } from 'react-bootstrap';
import NewsPicker from './NewsPicker';
import NewsFeedDragContainer from './NewsFeedDragContainer';

export default class NewsFeedForm extends Component {
  render() {
    const { htmlBody, cards, onChange } = this.props;
    return (
      <div>
        <NewsPicker
          htmlBody={htmlBody}
          cards={cards}
          onInsert={(news) => onChange(news.body)}
        />
        <FormGroup>
          <NewsFeedDragContainer
            htmlBody={htmlBody}
            cards={cards}
            onChange={() => {}}
          />
        </FormGroup>
      </div>
    );
  }
}
