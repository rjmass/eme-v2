import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import convertSparkpostSyntax from 'helpers/convertSparkpostSyntax';
import Card from './NewsFeedDragCard';

const style = {
  width: '100%'
};

@DragDropContext(HTML5Backend)
export default class NewsFeedDragContainer extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    cards: PropTypes.array
  };

  insertContent(components) {
    const { snippet, onChange } = this.props;
    const body = convertSparkpostSyntax(snippet.body, { newsfeed_result: components });
    onChange(body, components, snippet);
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

  handleDeleteComponent(idx) {
    const { cards } = this.props;
    const components = update(cards, { $splice: [[idx, 1]] });
    this.insertContent(components);
  }

  handleUpdateComponent(idx, newCard) {
    const { cards } = this.props;
    const components = update(cards, { $splice: [[idx, 1, newCard]] });
    this.insertContent(components);
  }

  render() {
    const { cards = [] } = this.props;

    return (
      <div style={style}>
        {cards && cards.map((card, i) => (
          <Card
            key={card.id}
            index={i}
            _id={card.id}
            item={card}
            moveCard={(dragIdx, hoverIdx) => this.handleMoveComponent(dragIdx, hoverIdx)}
            onDeleteCard={(idx) => this.handleDeleteComponent(idx)}
            onUpdateCard={(idx, updated) => this.handleUpdateComponent(idx, updated)}
          />
        ))}
      </div>
    );
  }
}
