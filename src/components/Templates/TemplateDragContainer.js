import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './TemplateDragCard';

const style = {
  width: '100%'
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
          name: 'First Component',
          value: '<p>First Component</p>'
        },
        {
          id: 2,
          name: 'Second Component',
          value: '<p>Second Component</p>'
        },
        {
          id: 3,
          name: 'Third Component',
          value: '<p>Third Component</p>'
        },
        {
          id: 4,
          name: 'Fourth Component',
          value: '<p>Fourth Component</p>'
        },
        {
          id: 5,
          name: 'Fifth Component',
          value: '<p>Fifth Component</p>'
        },
        {
          id: 6,
          name: 'Sixth Component',
          value: '<p>Sixth Component</p>'
        },
        {
          id: 7,
          name: 'Seventh Component',
          value: '<p>Seventh Component</p>'
        },
        {
          id: 8,
          name: 'Eighth Component',
          value: '<p>Eighth Component</p>'
        },
      ]
    };
  }

  insertContent() {
    const { htmlString, onChange } = this.props;
    const parser = new DOMParser();
    const components = this.state.cards.reduce((acc, card) => {
      acc += card.value;
      return acc;
    }, '');
    const html = parser.parseFromString(htmlString, 'name/html');
    html.getElementById('email-body').innerHTML = components;
    onChange(html.documentElement.innerHTML);
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

  handleSnippetSelect(snippet, idx) {
    const cards = this.state.cards.slice();
    if (!snippet) {
      cards.splice(idx, 1);
    } else {
      cards[idx].value = snippet.body;
      cards[idx].name = snippet.name;
    }
    this.setState({ cards }, this.insertContent);
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
            name={card.name}
            value={card.value}
            moveCard={(dragIdx, hoverIdx) => this.moveCard(dragIdx, hoverIdx)}
            onSnippetSelect={(snippet) => this.handleSnippetSelect(snippet, i)}
          />
        ))}
      </div>
    );
  }
}
