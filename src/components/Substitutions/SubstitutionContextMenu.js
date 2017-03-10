import React, { Component } from 'react';
import { Menu } from 'react-data-grid/addons';
const { ContextMenu, MenuItem } = Menu;
import './SubstitutionContextMenu.css';

export default class SubstitutionContextMenu extends Component {

  render() {
    return (
      <ContextMenu>
        <MenuItem
          data={{ rowIdx: this.props.rowIdx, columnIdx: this.props.idx }}
          onClick={(event, data) => this.props.onPropertyRename(data)}
        >
          Rename Property
        </MenuItem>
        <MenuItem
          data={{ rowIdx: this.props.rowIdx }}
          onClick={(event, data) => this.props.onRowDelete(data)}
        >
          Delete Row
        </MenuItem>
        <MenuItem
          data={{ columnIdx: this.props.idx }}
          onClick={(event, data) => this.props.onColumnDelete(data)}
        >
          Delete Column
        </MenuItem>
      </ContextMenu>
    );
  }
}
