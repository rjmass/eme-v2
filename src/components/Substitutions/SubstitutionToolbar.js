import React from 'react';
import { Toolbar } from 'react-data-grid/addons';
import { Button } from 'react-bootstrap';
import 'theme/DataGridToolbar.css';

export default class SubstitutionToolbar extends Toolbar {

  onAddColumn() {
    if (this.props.onAddColumn !== null && this.props.onAddColumn instanceof Function) {
      this.props.onAddColumn();
    }
  }

  onImport(e) {
    if (this.props.onImport !== null && this.props.onImport instanceof Function) {
      this.props.onImport(e);
    }
  }

  renderAddColumnButton() {
    if (this.props.onAddColumn) {
      return (
        <Button
          bsStyle="primary"
          onClick={(event) => this.onAddColumn(event)}
        >
          <i className="fa fa-columns" /> Add Column
        </Button>
      );
    }
    return null;
  }

  renderImportButton() {
    if (this.props.onImport) {
      return (
        <div>
          <label className="btn btn-file btn-success">
            <i className="fa fa-cloud-upload" /> CSV Upload
            <input
              type="file"
              name="csvImport"
              accept="text/csv"
              onChange={(e) => this.onImport(e)}
            />
          </label>
          &nbsp;&nbsp;&nbsp;Ensure that you click <strong>Save List</strong>
          &nbsp;after uploading or modifying data.
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="react-grid-Toolbar">
        <div className="tools pull-left">
          {this.renderImportButton()}
        </div>
        <div className="tools">
          {this.renderAddRowButton()}
          &nbsp;
          {this.renderAddColumnButton()}
          &nbsp;
          {this.renderToggleFilterButton()}
        </div>
      </div>
    );
  }
}
