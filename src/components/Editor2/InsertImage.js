import React, { Component, PropTypes } from 'react';
import { ImagePickDialog } from 'components/Images';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { dialogs } from 'decorators';

@dialogs()
class InsertImage extends Component {

  static propTypes = {
    onInsert: PropTypes.func.isRequired,
  }

  render() {
    const { onInsert } = this.props;
    const { insert } = this.state.dialogs;
    const tooltip = (
      <Tooltip id="tooltip">
        Insert image..
      </Tooltip>
    );
    return (
      <div>
        <div className="cke_toolgroup">
          <OverlayTrigger placement="top" overlay={tooltip}>
            <Button
              className="cke_button"
              onClick={() => this.openDialog('insert')}
            >
              <i className="fa fa-picture-o" />
            </Button>
          </OverlayTrigger>
        </div>
        {insert &&
          <ImagePickDialog
            show={insert}
            onHide={() => this.closeDialog('insert')}
            onInsert={(snippet) => onInsert({ body: snippet })}
          />}
      </div>
    );
  }
}

export default InsertImage;
