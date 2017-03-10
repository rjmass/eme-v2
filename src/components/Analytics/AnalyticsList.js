import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import Selectors from 'helpers/DataGridSelectors';
import RowSorter from './RowSorter';
import RowFilter from './RowFilterer';
import isEqual from 'lodash/isEqual';
import sumBy from 'lodash/sumBy';
import every from 'lodash/every';
import sortBy from 'lodash/sortBy';
import columns from './sentEmailListColumns';
import Toolbar from './AnalyticsToolbar';
import { Row, Col } from 'react-bootstrap';
import { NO_CAMPAIGN } from './analyticsConst';
import AnalyticsDateRangeFormatter from './AnalyticsDateRangeFormatter';
import AnalyticsPercentFormatter from './AnalyticsPercentFormatter';
import { jsonToCSV } from 'helpers/csvHelper';
import AnalyticsSingleStatBox from './AnalyticsSingleStatBox';
import './dataGrid.css';

const analyticsSelectors = Selectors(RowFilter, RowSorter);

export default class AnalyticsList extends Component {
  constructor(...params) {
    super(...params);
    this.state = {
      rows: [],
      filters: {},
      sortColumn: null,
      sortDirection: null
    };
  }

  componentWillMount() {
    this.fillRows(this.props.rows);
  }

  componentWillReceiveProps(nextProps) {
    const oldData = this.props.rows;
    const newData = nextProps.rows;

    if (!isEqual(oldData, newData)) {
      this.fillRows(newData);
    }
  }

  onClearFilters() {
    this.setState({ filters: {} });
  }

  getRows() {
    return analyticsSelectors.getRows(this.state);
  }

  getRowsCount() {
    return this.getRows().length;
  }

  getValidFilterValues(columnId) {
    return this.state.rows.map(r => {
      let value = '';
      if (columnId === 'Campaign') {
        value = this.campaignFilter(r);
      } else if (columnId === 'Name') {
        value = this.nameFilter(r);
      } else {
        value = r[columnId];
      }
      return value;
    }).filter((item, i, a) => { return i === a.indexOf(item); });
  }

  getRowTotals() {
    const rows = this.getRows();
    const [firstRow = {}] = rows;
    const delivery = sumBy(rows, row => row.Delivered);
    const openUnique = sumBy(rows, row => row['Unique Open']);
    const clickUnique = sumBy(rows, row => row['Unique Click']);
    const linkUnsubscribeUnique = sumBy(rows, row => row['Unique Unsubscribe']);
    const injection = sumBy(rows, row => row.Sent);
    const sortedDates = sortBy(rows, row => row['Sent Date'].props.sortValue);
    const name = firstRow.Name && this.extractNameFromProps(firstRow.Name);
    return {
      Sent: injection,
      Delivered: delivery,
      Open: sumBy(rows, row => row.Open),
      'Unique Open': openUnique,
      Click: sumBy(rows, row => row.Click),
      'Unique Click': clickUnique,
      Bounce: sumBy(rows, row => row.Bounce),
      Spam: sumBy(rows, row => row.Spam),
      'Unique Unsubscribe': linkUnsubscribeUnique,
      'Unsubscribe Rate': <AnalyticsPercentFormatter
        value={this.roundRate(linkUnsubscribeUnique / delivery || 0)}
      />,
      CTR: <AnalyticsPercentFormatter value={this.roundRate(clickUnique / delivery || 0)} />,
      OR: <AnalyticsPercentFormatter value={this.roundRate(openUnique / delivery || 0)} />,
      DR: <AnalyticsPercentFormatter value={this.roundRate(delivery / injection || 0)} />,
      Name: every(rows, row => this.extractNameFromProps(row.Name) === name) ? name : '<Mixed>',
      Campaign: every(rows, { Campaign: firstRow.Campaign }) ? firstRow.Campaign : '<Mixed>',
      'Sent Date': {
        startDate: sortedDates.length ? sortedDates[0]['Sent Date'] : 'N/A',
        endDate: sortedDates.length ? sortedDates[sortedDates.length - 1]['Sent Date'] : 'N/A'
      }
    };
  }

  campaignFilter(row) {
    return row.Campaign ? row.Campaign.props.campaign.name : NO_CAMPAIGN;
  }

  nameFilter(row) {
    return row.Name.props.email.name;
  }

  fillRows(rows) {
    this.setState({ rows });
  }

  rowGetter(index) {
    const rows = this.getRows();
    return rows[index];
  }

  handleFilterChange(filter) {
    const newFilters = { ...this.state.filters };
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.setState({ filters: newFilters });
  }

  handleGridSort(sortColumn, sortDirection) {
    const updatedState = { ...this.state, sortColumn, sortDirection };
    this.setState(updatedState);
  }

  generateExport() {
    const data = this.getRows().map(row => {
      const campaign = row.Campaign.props && row.Campaign.props.campaign;
      return {
        ...row,
        Name: this.extractNameFromProps(row.Name),
        Campaign: campaign ? campaign.name : '',
        'Sent Date': row['Sent Date'].props.value,
        OR: row.OR.props.value / 100,
        DR: row.DR.props.value / 100,
        CTR: row.CTR.props.value / 100,
        UR: row.UR.props.value / 100
      };
    });
    const csvContent = 'data:text/csv;base64,';
    return csvContent + btoa(jsonToCSV(data));
  }

  extractNameFromProps(nameObj) {
    return nameObj.props.email.name;
  }

  roundRate(num) {
    return Math.round(num * 10000) / 100;
  }

  render() {
    const rowTotals = this.getRowTotals();
    return (
      <div>
        {this.state.rows.length &&
          <ReactDataGrid
            columns={columns}
            rowGetter={index => this.rowGetter(index)}
            rowsCount={this.getRowsCount()}
            toolbar={<Toolbar
              csvExport={this.generateExport()}
            />}
            onAddFilter={filter => this.handleFilterChange(filter)}
            onClearFilters={() => this.onClearFilters()}
            onGridSort={(sortCol, sortDir) => this.handleGridSort(sortCol, sortDir)}
            getValidFilterValues={(columnId) => this.getValidFilterValues(columnId)}
            minHeight={500}
          />
        }
        <div className="help-block" />
        <h4>Totals for the selected sent emails</h4>
        <Row>
          <Col xs={12} sm={6} md={4} lg={3}>
            <div className="stat-box stat-summary">
              <div className="stat-short-string">
                <strong>Name</strong>: {rowTotals.Name}
              </div>
              <div>
                <strong>Campaign</strong>: {rowTotals.Campaign}
              </div>
              <div>
                <AnalyticsDateRangeFormatter value={rowTotals['Sent Date']} />
              </div>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <AnalyticsSingleStatBox
              value={rowTotals.Sent.toLocaleString()}
              label="Sent"
              className="stat-sent"
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <AnalyticsSingleStatBox
              value={rowTotals.Delivered.toLocaleString()}
              label="Delivered"
              className="stat-delivered"
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <AnalyticsSingleStatBox
              value={rowTotals.DR}
              label="Delivery Rate"
              className="stat-dr"
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <AnalyticsSingleStatBox
              value={rowTotals['Unique Open'].toLocaleString()}
              label="Unique Open"
              className="stat-unique-open"
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <AnalyticsSingleStatBox
              value={rowTotals.OR}
              label="Open Rate"
              className="stat-or"
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <AnalyticsSingleStatBox
              value={rowTotals['Unique Unsubscribe'].toLocaleString()}
              label="Unique Unsubscribe"
              className="stat-unique-unsubscribe"
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <AnalyticsSingleStatBox
              value={rowTotals['Unsubscribe Rate']}
              label="Unsubscribe Rate"
              className="stat-unsubscribe-rate"
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <AnalyticsSingleStatBox
              value={rowTotals['Unique Click'].toLocaleString()}
              label="Unique Click"
              className="stat-unique-click"
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <AnalyticsSingleStatBox
              value={rowTotals.CTR}
              label="Click Through Rate"
              className="stat-ctr"
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <AnalyticsSingleStatBox
              value={rowTotals.Bounce.toLocaleString()}
              label="Bounce"
              className="stat-bounce"
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <AnalyticsSingleStatBox
              value={rowTotals.Spam.toLocaleString()}
              label="Spam Complaint"
              className="stat-spam-complaint"
            />
          </Col>
        </Row>
      </div>
    );
  }
}
