import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

export default class EmailActions extends Component {

  render() {
    const { onDelete, onClone,
      onSendPreview, onSendEmail,
      onTemplateReimport, onLockEmail, isLocked } = this.props;
    return (
      <div className={this.props.className}>
        <DropdownButton
          bsStyle="info"
          title="Actions"
          id="template-actions"
        >
          <MenuItem eventKey="lock" disabled={isLocked} onSelect={onLockEmail}>
            <span className="fa fa-lock" />&nbsp;&nbsp;
            Lock Email
          </MenuItem>
          <MenuItem eventKey="clone" disabled={isLocked} onSelect={onClone}>
            <span className="fa fa-files-o" />&nbsp;
            Clone Email
          </MenuItem>
          <MenuItem eventKey="clone" disabled={isLocked} onSelect={onTemplateReimport}>
            <span className="fa fa-repeat" />&nbsp;
            Reimport Template
          </MenuItem>
          <MenuItem eventKey="sendPreview" disabled={isLocked} onSelect={onSendPreview}>
            <span className="fa fa-paper-plane-o" />&nbsp;
            Send Preview
          </MenuItem>
          <MenuItem eventKey="sendEmail" disabled={isLocked} onSelect={onSendEmail}>
            <span className="fa fa-paper-plane" />&nbsp;
            Send Email
          </MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="delete" disabled={isLocked} onSelect={onDelete}>
            <span className="glyphicon glyphicon-remove" />&nbsp;
            Delete
          </MenuItem>
        </DropdownButton>
      </div>
    );
  }

}
