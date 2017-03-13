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

  insertContent(components) {
    const { htmlString, onChange } = this.props;
    const parser = new DOMParser();
    const componentString = components.reduce((acc, card) => {
      acc += card.value;
      return acc;
    }, '');
    const html = parser.parseFromString(htmlString, 'text/html');
    html.getElementById('email-body').innerHTML = componentString;
    onChange(html.documentElement.innerHTML, components);
  }


  moveCard(dragIndex, hoverIndex) {
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

  handleSnippetSelect(snippet, idx) {
    const components = this.props.cards.slice();
    const newComponent = {};
    if (!snippet) {
      components.splice(idx, 1);
    } else {
      newComponent.name = snippet.name;
      newComponent.value = snippet.body;
      components.splice(idx, 1, newComponent);
    }
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
            id={card._id}
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
