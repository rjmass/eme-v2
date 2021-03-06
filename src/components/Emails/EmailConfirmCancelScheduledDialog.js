import React from 'react';
import { ModalDialog } from 'components/Modal';
import { Button } from 'react-bootstrap';

const EmailConfirmCancelScheduledDialog = (props) => {
  return (
    <ModalDialog
      show={props.show}
      onHide={props.onCancel}
      title={'Cancel Scheduled Email Send?'}
      text={`This will cancel scheduled send for this email,
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

export default EmailConfirmCancelScheduledDialog;
