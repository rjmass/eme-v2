import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './NewsFeedDragCard';

const style = {
  width: '100%'
};

@DragDropContext(HTML5Backend)
export default class NewsFeedDragContainer extends Component {
  static propTypes = {
    htmlBody: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    cards: PropTypes.array
  };

  insertContent(components) {
    const { htmlBody, onChange } = this.props;
    const parser = new DOMParser();
    const componentString = components.reduce((acc, card) => {
      acc += (card.snippet.body || '');
      return acc;
    }, '');
    const html = parser.parseFromString(htmlBody, 'text/html');
    html.getElementById('email-body').innerHTML = componentString;
    onChange(html.documentElement.innerHTML, components);
  }

  handleMoveComponent(dragIndex, hoverIndex) {
    const { cards } = this.props;
    const dragCard = cards[dragIndex];
    const components = update(cards, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragCard]
      ]
    });
    this.insertContent(components);
  }

  render() {
    const { cards = [] } = this.props;

    return (
      <div style={style}>
        {cards && cards.map((card, i) => (
          <Card
            key={card._id}
            index={i}
            _id={card._id}
            item={card}
            moveCard={(dragIdx, hoverIdx) => this.handleMoveComponent(dragIdx, hoverIdx)}
          />
        ))}
      </div>
    );
  }
}