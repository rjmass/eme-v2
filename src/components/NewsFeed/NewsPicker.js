import React, { Component, PropTypes } from 'react';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import NewsQueryDialog from './NewsQueryDialog';
import { dialogs } from 'decorators';

@dialogs()
class NewsPicker extends Component {
  static propTypes = {
    onInsert: PropTypes.func
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
        {insert && <NewsQueryDialog
          show={insert}
          onHide={() => this.closeDialog('insert')}
          onSubmit={onInsert}
        />}
        <OverlayTrigger placement="top" overlay={tooltip}>
          <Button
            onClick={() => this.openDialog('insert')}
          >
            <i className="fa fa-list" />
          </Button>
        </OverlayTrigger>
      </div>
    );
  }
}

export default NewsPicker;
