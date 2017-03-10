import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

export default class TemplateActions extends Component {

  render() {
    const { onDelete, onClone, onGenerateEmail } = this.props;
    return (
      <div className={this.props.className}>
        <DropdownButton
          bsStyle="info"
          title="Actions"
          id="template-actions"
        >
          <MenuItem eventKey="clone" onClick={onClone}>
            <span className="fa fa-files-o" />&nbsp;
            Clone
          </MenuItem>
          <MenuItem eventKey="generateEmail" onClick={onGenerateEmail}>
            <span className="fa fa-envelope-o" />&nbsp;
            Generate Email
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
