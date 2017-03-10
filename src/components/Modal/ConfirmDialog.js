import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { ModalDialog } from './';

export default class ConfirmDialog extends Component {
  render() {
    const { show, onCancel, onHide = onCancel, onConfirm, text } = this.props;
    const onConfirmHide = () => onConfirm(onHide());

    return (
      <ModalDialog
        show={show}
        onHide={onHide}
        title="Confirm action"
        text={text}
        buttons={[
          (<Button key="yes" bsStyle="primary" onClick={() => onConfirmHide()}>
            Proceed
          </Button>),
          (<Button key="no" onClick={onHide}>
            Cancel
          </Button>)
        ]}
      />
    );
  }
}
