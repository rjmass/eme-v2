import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './TemplateDragCard';
import { Button, ControlLabel } from 'react-bootstrap';
import getLodashVars from 'helpers/getLodashVars';
import template from 'lodash/template';

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

  constructor(props) {
    super(props);
    this.state = {
      contentAreaCount: 0
    };
  }

  insertContent(components) {
    const { htmlString, onChange } = this.props;
    const parser = new DOMParser();
    const componentString = components.reduce((acc, card) => {
      acc += card.snippet.body || '';
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

  checkContentArea(snippet, idx) {
    const body = snippet ? snippet.body : this.props.cards[idx].snippet.body;
    const isContentArea = getLodashVars(body).includes('Content_Area');
    if (isContentArea) {
      const areaCount = snippet ? this.state.contentAreaCount - 1 : this.state.contentAreaCount - 1;
      const name = `Comment ${areaCount + 1}`;
      const templateFunc = template(body);
      if (snippet) {
        snippet.body = templateFunc({ Content_Area: name });
      }
      this.setState({ contentAreaCount: areaCount });
    }
  }

  handleSnippetSelect(snippet, idx) {
    this.checkContentArea(snippet, idx);
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
