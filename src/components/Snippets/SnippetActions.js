import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

export default class SnippetActions extends Component {

  render() {
    const { onDelete, onClone } = this.props;
    return (
      <div className={this.props.className}>
        <DropdownButton
          bsStyle="info"
          title="Actions"
          id="snippet-actions"
        >
          <MenuItem eventKey="clone" onClick={onClone}>
            <span className="fa fa-files-o" />&nbsp;
            Clone
          </MenuItem>
          <MenuItem eventKey="delete" onClick={onDelete}>
            <span className="glyphicon glyphicon-remove" />&nbsp;
            Delete
          </MenuItem>
        </DropdownButton>
      </div>
    );
  }

}
