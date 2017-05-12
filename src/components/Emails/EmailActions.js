import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

export default class EmailActions extends Component {

  render() {
    const { onDelete, onClone, adminUser,
      onSendPreview, onSendEmail, onUnlockEmail,
      onTemplateReimport, onLockEmail, lockedByOther, lock } = this.props;
    const canUnlock = !lockedByOther || adminUser;
    return (
      <div className={this.props.className}>
        <DropdownButton
          bsStyle="info"
          title="Actions"
          id="template-actions"
        >
          {lock
            ? <MenuItem eventKey="lock" disabled={!canUnlock} onSelect={onUnlockEmail}>
              <span className="fa fa-unlock" />&nbsp;&nbsp;
              Unlock Email
            </MenuItem>
            : <MenuItem eventKey="lock" onSelect={onLockEmail}>
              <span className="fa fa-lock" />&nbsp;&nbsp;
              Lock Email
            </MenuItem>}
          <MenuItem eventKey="clone" disabled={lockedByOther} onSelect={onClone}>
            <span className="fa fa-files-o" />&nbsp;
            Clone Email
          </MenuItem>
          <MenuItem eventKey="clone" disabled={lockedByOther} onSelect={onTemplateReimport}>
            <span className="fa fa-repeat" />&nbsp;
            Reimport Template
          </MenuItem>
          <MenuItem eventKey="sendPreview" disabled={lockedByOther} onSelect={onSendPreview}>
            <span className="fa fa-paper-plane-o" />&nbsp;
            Send Preview
          </MenuItem>
          <MenuItem eventKey="sendEmail" disabled={lockedByOther} onSelect={onSendEmail}>
            <span className="fa fa-paper-plane" />&nbsp;
            Send Email
          </MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="delete" disabled={lockedByOther} onSelect={onDelete}>
            <span className="glyphicon glyphicon-remove" />&nbsp;
            Delete
          </MenuItem>
        </DropdownButton>
      </div>
    );
  }

}
