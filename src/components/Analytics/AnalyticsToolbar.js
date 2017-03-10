import React from 'react';
import { Toolbar } from 'react-data-grid/addons';
import { Button, ControlLabel } from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';
import 'theme/DataGridToolbar.css';

export default class AnalyticsToolbar extends Toolbar {
  componentWillMount() {
    this.props.onToggleFilter();
  }

  renderIsolateButton() {
    if (this.props.onIsolateRows) {
      return (
        <div>
          <ControlLabel>Isolate Rows</ControlLabel>
          <Switch
            state={this.props.isolationEnabled}
            onChange={(event) => this.props.onIsolateRows(event)}
          />
        </div>
      );
    }
    return null;
  }

  renderExportButton() {
    if (this.props.csvExport) {
      return (
        <a href={this.props.csvExport} download={`MeMe - Sent Emails - ${new Date()}.csv`}>
          <Button className="btn btn-success" onClick={this.props.onExport}>
            <i className="fa fa-cloud-download" /> CSV Export
          </Button>
        </a>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="react-grid-Toolbar">
        <div className="tools pull-left">
          {this.renderExportButton()}
        </div>
        <div className="tools">
          {this.renderIsolateButton()}
        </div>
      </div>
    );
  }
}
