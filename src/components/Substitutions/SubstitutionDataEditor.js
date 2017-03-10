import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import ReactDataGrid from 'react-data-grid';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import parseType from 'helpers/parseType';
import 'react-data-grid/themes/react-data-grid.css';
import Toolbar from './SubstitutionToolbar';
import ContextMenu from './SubstitutionContextMenu';
import RenameModal from './SubstitutionRenameModal';
import { substitutionDataUpdated,
  substitutionValidationError
} from 'redux/modules/substitutions';
import { dialogs } from 'decorators';
import { csvToJSON } from 'helpers/csvHelper';
import SubstitutionStringFormatter from './SubstitutionStringFormatter';
import { notifications } from 'redux/modules/notifications';
import { ModalDialog } from 'components/Modal';
import { Button } from 'react-bootstrap';

const mandatoryFixedFields = ['email', 'value'];

export class SubstitutionDataEditor extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    substitutionId: PropTypes.string.isRequired
  }

  constructor(...params) {
    super(...params);
    this.state = {
      ...this.state,
      rows: [],
      columns: [],
      selectedColumn: {}
    };
  }

  componentDidMount() {
    const data = this.props.data;
    this.mapDataToState(data);
  }

  componentWillReceiveProps(nextProps) {
    const oldData = this.props.data;
    const newData = nextProps.data;

    if (!isEqual(oldData, newData)) {
      this.mapDataToState(newData);
    }
  }

  onRowDelete(data) {
    this.openDialog('rowDelete');
    this.setState({ deleteRowData: data });
  }

  onColumnDelete(data) {
    this.openDialog('columnDelete');
    this.setState({ deleteColumnData: data });
  }

  getRowsCount() {
    return this.state.rows.length;
  }

  getColumnsCount() {
    return this.state.columns.length;
  }

  deleteRow() {
    this.closeDialog('rowDelete');
    const { deleteRowData } = this.state;
    const rowsCopy = this.state.rows.slice();
    rowsCopy.splice(deleteRowData.rowIdx, 1);
    this.setState({ rows: rowsCopy });
    return this.dispatchUpdate(rowsCopy);
  }

  deleteColumn() {
    this.closeDialog('columnDelete');
    const { deleteColumnData } = this.state;
    const column = this.state.columns[deleteColumnData.columnIdx];
    if (mandatoryFixedFields.find((col) => column.name === col)) {
      const { dispatch } = this.props;
      return dispatch(notifications.danger('Cannot delete column'));
    }
    const rows = this.state.rows.map((row) => omit(row, column.name));
    this.setState({ rows });
    return this.dispatchUpdate(rows);
  }

  dispatchUpdate(updatedRows) {
    const { dispatch, substitutionId } = this.props;
    const body = this.filterEmptyRows(updatedRows);
    dispatch(substitutionDataUpdated(substitutionId, body));
  }

  handleRowUpdated(event) {
    const eventField = Object.keys(event.updated)[0];
    const parsedUpdated = parseType(event.updated[eventField]);
    const rows = this.state.rows.map((row, idx) => {
      return (idx === event.rowIdx) ? { ...row, [eventField]: parsedUpdated } : row;
    });
    this.setState({ rows });
    this.dispatchUpdate(rows);
  }

  createRowsFromData(data) {
    return data.map((row, idx) => ({ value: idx, ...row }));
  }

  createColumnsFromData(data) {
    const allKeys = data.reduce((acc, item) => {
      const keys = Object.keys(item);
      keys.forEach(k => acc.add(k));
      return acc;
    }, new Set());
    const array = Array.from(allKeys);
    const otherFields = array.filter(a => !mandatoryFixedFields.includes(a)).sort();
    const sortedArray = [...mandatoryFixedFields, ...otherFields];
    return sortedArray
      .filter(column => column !== 'value')
      .map(key => {
        return {
          key,
          name: key,
          editable: true,
          resizable: true,
          formatter: SubstitutionStringFormatter
        };
      });
  }

  filterEmptyRows(data) {
    return data.filter(item => Object.entries(item).some(keyValPair => {
      return keyValPair[0] !== 'value' ? keyValPair[1] : false;
    }));
  }

  filterEmptyColumns(data) {
    return data.filter(item => Object.entries(item).some(keyValPair => {
      return keyValPair[0] !== 'value' ? keyValPair[1] : false;
    }));
  }

  handleAddRow(event) {
    const newRow = {};
    newRow.value = event.newRowIndex;
    this.state.columns.map(column => (newRow[column.key] = ''));
    const rowsCopy = this.state.rows.slice();
    rowsCopy.push(newRow);
    this.setState({ rows: rowsCopy });
  }

  displayRenamePropertyModal(data) {
    const columnKey = this.state.columns[data.columnIdx].key;
    if (mandatoryFixedFields.find(prop => columnKey === prop)) {
      const { dispatch } = this.props;
      return dispatch(notifications.danger('Cannot rename property'));
    }
    this.setState({ selectedColumn: { columnKey } });
    return this.openDialog('rename');
  }

  renameProperty(oldKey, newKey) {
    this.closeDialog('rename');
    if (mandatoryFixedFields.find(prop => newKey === prop)) {
      const { dispatch } = this.props;
      return dispatch(notifications.danger('Cannot rename property'));
    }
    const updatedRows = this.updateRowsPropertyName(oldKey, newKey);
    return this.dispatchUpdate(updatedRows);
  }

  extendRowWithColumn(columnKey) {
    const updatedRows = this.state.rows.map(row => ({ ...row, [columnKey]: '' }));
    this.setState({ rows: updatedRows });
    return updatedRows;
  }

  updateRowsPropertyName(oldKey, newKey) {
    return this.state.rows.map(row => ({ ...omit(row, oldKey), [newKey]: row[oldKey] }));
  }

  async handleImport(e) {
    const { dispatch } = this.props;
    try {
      const json = await csvToJSON(e.target.files[0]);
      return this.dispatchUpdate(json);
    } catch (err) {
      return dispatch(substitutionValidationError(err));
    }
  }

  handleAddColumn() {
    const columnKey = `NewColumn${this.getColumnsCount() + 1}`;
    const newColumn = {
      key: columnKey,
      name: columnKey,
      editable: true,
      resizable: true,
      formatter: SubstitutionStringFormatter
    };
    const columnsCopy = this.state.columns.slice();
    columnsCopy.push(newColumn);
    const newRows = this.extendRowWithColumn(columnKey);
    this.dispatchUpdate(newRows);
  }

  rowGetter(index) {
    return this.state.rows[index];
  }

  mapDataToState(data) {
    this.setState({
      columns: this.createColumnsFromData(data),
      rows: this.createRowsFromData(data)
    });
  }

  render() {
    const toolbar = (<Toolbar
      onAddColumn={event => this.handleAddColumn(event)}
      onAddRow={event => this.handleAddRow(event)}
      onImport={event => this.handleImport(event)}
    />);
    const contextMenu = (<ContextMenu
      onPropertyRename={(data) => this.displayRenamePropertyModal(data)}
      onRowDelete={(data) => this.onRowDelete(data)}
      onColumnDelete={(data) => this.onColumnDelete(data)}
    />);

    return (
      <div>
        <RenameModal
          show={this.state.dialogs.rename}
          onHide={() => this.closeDialog('rename')}
          selectedColumn={this.state.selectedColumn}
          onConfirm={(oldKey, newKey) => this.renameProperty(oldKey, newKey)}
        />
        <ModalDialog
          show={this.state.dialogs.rowDelete}
          onHide={() => this.closeDialog('rowDelete')}
          title={'Delete row?'}
          text={`This will delete this row,
              do you wish to proceed?`}
          buttons={[
            <Button key={1} onClick={() => this.closeDialog('rowDelete')}>No</Button>,
            <Button key={2} bsStyle="primary" onClick={() => this.deleteRow()}>
                Yes, proceed
            </Button>
          ]}
        />
        <ModalDialog
          show={this.state.dialogs.columnDelete}
          onHide={() => this.closeDialog('columnDelete')}
          title={'Delete column?'}
          text={`This will delete this column,
              do you wish to proceed?`}
          buttons={[
            <Button key={1} onClick={() => this.closeDialog('columnDelete')}>No</Button>,
            <Button key={2} bsStyle="primary" onClick={() => this.deleteColumn()}>
                Yes, proceed
            </Button>
          ]}
        />
        <ReactDataGrid
          enableCellSelect
          contextMenu={contextMenu}
          columns={this.state.columns}
          rowsCount={this.getRowsCount()}
          rowGetter={index => this.rowGetter(index)}
          onRowUpdated={event => this.handleRowUpdated(event)}
          toolbar={toolbar}
          minHeight={500}
        />
      </div>
    );
  }
}

@connect()
@dialogs()
export default class SubstitutionDataEditorConnected extends SubstitutionDataEditor { }
