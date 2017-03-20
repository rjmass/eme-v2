import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './TemplateDragCard';
import { Button, ControlLabel } from 'react-bootstrap';

const style = {
  width: '100%'
};

@DragDropContext(HTML5Backend)
export default class TemplateDragContainer extends Component {
  static propTypes = {
    htmlString: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    cards: PropTypes.array
  };

  insertContent(components) {
    const { htmlString, onChange } = this.props;
    let areaCount = 0;
    const parser = new DOMParser();
    const contentReplacer = () => {
      ++areaCount;
      return `Comment ${areaCount}`;
    };
    const componentString = components.reduce((acc, card) => {
      acc += (card.snippet.body || '').replace(/COMMENT_AREA/g, contentReplacer);
      return acc;
    }, '');
    const html = parser.parseFromString(htmlString, 'text/html');
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

  handleAddComponent() {
    const components = this.props.cards.slice();
    components.push({ _id: Date.now().toString(), snippet: {} });
    this.insertContent(components);
  }

  handleSnippetSelect(snippet, idx) {
    const components = this.props.cards.slice();
    const newComponent = {};
    if (!snippet) {
      components.splice(idx, 1);
    } else {
      newComponent.snippet = snippet;
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
            _id={card._id}
            name={card.snippet.name}
            value={card.snippet.body}
            moveCard={(dragIdx, hoverIdx) => this.handleMoveComponent(dragIdx, hoverIdx)}
            onSnippetSelect={(snippet) => this.handleSnippetSelect(snippet, i)}
          />
        ))}
        <div className="pull-right">
          <ControlLabel />
          <Button onClick={() => this.handleAddComponent()}>Add Component</Button>
        </div>
      </div>
    );
  }
}
