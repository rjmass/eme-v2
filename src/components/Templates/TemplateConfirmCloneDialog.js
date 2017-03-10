import React from 'react';
import { ModalDialog } from 'components/Modal';
import { Button } from 'react-bootstrap';

const TemplateConfirmCloneDialog = (props) => {
  return (
    <ModalDialog
      show={props.show}
      onHide={props.onCancel}
      title={'Clone template?'}
      text={`The content of the template has changed since last saving.
              This operation will save the current copy before cloning.
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

export default TemplateConfirmCloneDialog;
