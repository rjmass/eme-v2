import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './TemplateDragCard';

const style = {
  width: 400
};

@DragDropContext(HTML5Backend)
export default class TemplateDragContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        {
          id: 1,
          text: 'First Component'
        },
        {
          id: 2,
          text: 'Second Component'
        },
        {
          id: 3,
          text: 'Third Component'
        },
        {
          id: 4,
          text: 'Fourth Component'
        }
      ]
    };
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));
  }

  render() {
    const { cards } = this.state;

    return (
      <div style={style}>
        {cards.map((card, i) => (
          <Card
            key={card.id}
            index={i}
            id={card.id}
            text={card.text}
            moveCard={(dragIdx, hoverIdx) => this.moveCard(dragIdx, hoverIdx)}
          />
        ))}
      </div>
    );
  }
}
