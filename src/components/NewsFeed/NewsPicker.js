import React, { Component, PropTypes } from 'react';
import { FormGroup, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import NewsQueryDialog from './NewsQueryDialog';
import { dialogs } from 'decorators';

import './NewsPicker.css';

@dialogs()
class NewsPicker extends Component {
  static propTypes = {
    onInsert: PropTypes.func,
    htmlBody: PropTypes.string,
    cards: PropTypes.array
  }

  render() {
    const { onInsert } = this.props;
    const { insert } = this.state.dialogs;

    const tooltip = (
      <Tooltip id="tooltip">
        Insert FT Articles..
      </Tooltip>
    );
    return (
      <div>
        <FormGroup className="list-group-item list-group-item-info newspicker-header">
          {insert && <NewsQueryDialog
            show={insert}
            onHide={() => this.closeDialog('insert')}
            onSubmit={onInsert}
          />}
          <Button onClick={() => onInsert('', [], {})}>
            Remove all
          </Button>
          <OverlayTrigger placement="top" overlay={tooltip}>
            <Button
              className="pull-right"
              onClick={() => this.openDialog('insert')}
            >
              <i className="fa fa-list" />
            </Button>
          </OverlayTrigger>
        </FormGroup>
      </div>
    );
  }
}

export default NewsPicker;
