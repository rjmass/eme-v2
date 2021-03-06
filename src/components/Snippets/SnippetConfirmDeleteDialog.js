import React from 'react';
import { ModalDialog } from 'components/Modal';
import { Button } from 'react-bootstrap';

const SnippetDeleteConfirmDialog = (props) => {
  return (
    <ModalDialog
      show={props.show}
      onHide={props.onCancel}
      title={'Delete snippet?'}
      text={`This will permanently delete this snippet.
        Do you wish to proceed?`}
      buttons={[
        <Button key={1} onClick={props.onCancel}>No</Button>,
        <Button key={2} bsStyle="primary" onClick={props.onConfirm}>
            Yes, proceed
        </Button>
      ]}
    />
    );
};

export default SnippetDeleteConfirmDialog;
