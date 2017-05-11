import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

export default class EmailActions extends Component {

  render() {
    const { onDelete, onClone,
      onSendPreview, onSendEmail,
      onTemplateReimport, onLockEmail } = this.props;
    return (
      <div className={this.props.className}>
        <DropdownButton
          bsStyle="info"
          title="Actions"
          id="template-actions"
        >
          <MenuItem eventKey="lock" onClick={onLockEmail}>
            <span className="fa fa-lock" />&nbsp;&nbsp;
            Lock Email
          </MenuItem>
          <MenuItem eventKey="clone" onClick={onClone}>
            <span className="fa fa-files-o" />&nbsp;
            Clone Email
          </MenuItem>
          <MenuItem eventKey="clone" onClick={onTemplateReimport}>
            <span className="fa fa-repeat" />&nbsp;
            Reimport Template
          </MenuItem>
          <MenuItem eventKey="sendPreview" onClick={onSendPreview}>
            <span className="fa fa-paper-plane-o" />&nbsp;
            Send Preview
          </MenuItem>
          <MenuItem eventKey="sendEmail" onClick={onSendEmail}>
            <span className="fa fa-paper-plane" />&nbsp;
            Send Email
          </MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="delete" onClick={onDelete}>
            <span className="glyphicon glyphicon-remove" />&nbsp;
            Delete
          </MenuItem>
        </DropdownButton>
      </div>
    );
  }

}
