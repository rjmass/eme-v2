import React, { Component, PropTypes } from 'react';
import InsertContentAreaDialog from './InsertContentAreaDialog';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { dialogs } from 'decorators';

@dialogs()
class ContentArea extends Component {

  static propTypes = {
    onInsert: PropTypes.func.isRequired,
  }

  handleInsert(snippet) {
    const { onInsert } = this.props;
    onInsert(snippet);
    this.closeDialog('insert');
  }

  render() {
    const { currentHTMLBody } = this.props;
    const { insert } = this.state.dialogs;
    const tooltip = (
      <Tooltip id="tooltip">
        Insert content area..
      </Tooltip>
    );
    return (
      <div>
        <OverlayTrigger placement="top" overlay={tooltip}>
          <Button
            onClick={() => this.openDialog('insert')}
          >
            <i className="fa fa-code" />
          </Button>
        </OverlayTrigger>
        {insert &&
          <InsertContentAreaDialog
            show={insert}
            onHide={() => this.closeDialog('insert')}
            onInsert={(snippet) => this.handleInsert(snippet)}
            currentHTMLBody={currentHTMLBody}
          />}
      </div>
    );
  }
}

export default ContentArea;
