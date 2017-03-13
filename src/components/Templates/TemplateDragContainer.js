import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './TemplateDragCard';

const style = {
  width: 400
};

@DragDropContext(HTML5Backend)
export default class TemplateDragContainer extends Component {
  static propTypes = {
    htmlString: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      cards: [
        {
          id: 1,
          text: 'First Component',
          value: '<p>First Component</p>'
        },
        {
          id: 2,
          text: 'Second Component',
          value: '<p>Second Component</p>'
        },
        {
          id: 3,
          text: 'Third Component',
          value: '<p>Third Component</p>'
        },
        {
          id: 4,
          text: 'Fourth Component',
          value: '<p>Fourth Component</p>'
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
    }), this.insertContent);
  }

  insertContent() {
    const { htmlString, onChange } = this.props;
    const parser = new DOMParser();
    const components = this.state.cards.reduce((acc, card) => {
      acc += card.value;
      return acc;
    }, '');
    const html = parser.parseFromString(htmlString, 'text/html');
    html.getElementById('email-body').innerHTML = components;
    onChange(html.documentElement.innerHTML);
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
