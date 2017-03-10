import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

export default class SubstitutionActions extends Component {

  render() {
    const { onDelete } = this.props;
    return (
      <div className={this.props.className}>
        <DropdownButton
          bsStyle="info"
          title="Actions"
          id="campaign-actions"
        >
          <MenuItem eventKey="delete" onClick={onDelete}>
            <span className="glyphicon glyphicon-remove" />&nbsp;
            Delete
          </MenuItem>
        </DropdownButton>
      </div>
    );
  }

}
