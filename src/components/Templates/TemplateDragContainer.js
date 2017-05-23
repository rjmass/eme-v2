import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './TemplateDragCard';
import { Button, ControlLabel } from 'react-bootstrap';
let cheerio = require('cheerio')

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
    const parser = new DOMParser();
    let typeRegister = {};
    const placeHolderPattern = /<!--mdPlaceholder::\d{1,5}-->+/g;
    const markDownPattern = /{{\s*([^}]|(}?[^}]*)\s)*\s*}}/g; // match handlebar style markdown
    const typeReplacer = (fieldType) => {
      if(typeof typeRegister[fieldType] === 'undefined') {
        typeRegister[fieldType] = 0;
      }
      typeRegister[fieldType]++;
      const fieldTypeProperCase =
        fieldType.charAt(0).toUpperCase() + fieldType.slice(1).toLowerCase();
      return `${fieldTypeProperCase} ${typeRegister[fieldType]}`;
    }

    let componentString = '';
    for (let component of components) {
      if(component.snippet.body){
        let markDowns = []; // used to store markdown for later reinsertion after dom manipulation
        const componentBody = component.snippet.body.replace(placeHolderPattern, (match, name) => {
          return ''; // prevent hack attempts from false placeholders (a bit paranoid)
        });
        const htmlSanitised = componentBody.replace(markDownPattern, (match, name) => {
          markDowns.push(match); // save match for later, this will get reinstated
          return `<!--mdPlaceholder::${markDowns.length-1}-->`;
        });
        let htmlObj = cheerio.load(htmlSanitised);
        for (let ce of htmlObj('content').toArray()) {  // itterate for each contentElement
          const fieldType = ce.attribs.name.toUpperCase();  // be case insensitive
          ce.attribs.name = typeReplacer(fieldType);
          ce.attribs['data-eme-type'] = fieldType;
        }
        // look for markDown placeholders and reinstate the removed markdown
        componentString += htmlObj.html().replace(placeHolderPattern, (match, name) => {
          return markDowns[new RegExp(/\d{1,5}/).exec(match)];
        });
      }
    }
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
            card={card}
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
