import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from './TemplateDragItemTypes';
import { SnippetPicker } from 'components/Snippets';

const style = {
  border: '1px dashed grey',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move'
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props._id,
      index: props.index
    };
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get verticle middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items
    // height

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Warn - mutates monitor item - for performance
    monitor.getItem().index = hoverIndex;
  }
};

export class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    onSnippetSelect: PropTypes.func.isRequired,
    moveCard: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isNewsfeed: PropTypes.bool,
    isDragging: PropTypes.bool.isRequired,
    _id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
  };

  handleOnSnippetSelect(snippet) {
    const { onSnippetSelect } = this.props;
    onSnippetSelect(snippet);
  }

  render() {
    const { card, isDragging, connectDragSource, connectDropTarget } = this.props;
    const { snippet } = card;
    const opacity = isDragging ? 0 : 1;
    const handleSnippetSelect = (s) => this.handleOnSnippetSelect(s);

    return connectDragSource(connectDropTarget(
      <div style={{ ...style, opacity }}>
        <strong>{snippet.name}</strong>
        <div className="help-block" />
        <SnippetPicker
          html
          value={snippet.name}
          onSelect={handleSnippetSelect}
        />
      </div>
    ));
  }
}

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class CardConnected extends Card { }
