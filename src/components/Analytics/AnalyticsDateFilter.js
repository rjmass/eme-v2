import React, { Component } from 'react';
import moment from 'moment';
import { Button, Glyphicon } from 'react-bootstrap';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import './AnalyticsDateFilter.css';

export default class AnalyticsDateFilter extends Component {
  constructor(...params) {
    super(...params);
    this.state = {
      ranges: {
        Today: [moment().startOf('day'), moment()],
        Yesterday: [
          moment().subtract(1, 'days').startOf('day'),
          moment().subtract(1, 'days').endOf('day')
        ],
        'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment()],
        'This Month': [moment().startOf('month'), moment()],
        'Previous Month': [
          moment().subtract(1, 'month').startOf('month'),
          moment().subtract(1, 'month').endOf('month')
        ]
      },
      startDate: moment().subtract(2, 'years').startOf('year'),
      endDate: moment()
    };
  }

  handleEvent(event, picker) {
    const dateRange = {
      startDate: picker.startDate,
      endDate: picker.endDate
    };
    this.setState(dateRange);
    this.props.onChange({
      filterTerm: dateRange,
      column: this.props.column,
      rawValue: '',
      filterValues: this.filterValues
    });
  }

  filterValues(row, columnFilter, columnKey) {
    const { filterTerm: { startDate, endDate } } = columnFilter;
    const rowDate = row[columnKey].props.sortValue;
    return rowDate >= startDate && rowDate <= endDate;
  }

  render() {
    const start = this.state.startDate.format('DD-MM-YYYY');
    const end = this.state.endDate.format('DD-MM-YYYY');
    let label = `${start} - ${end}`;
    if (start === end) {
      label = start;
    }
    return (
      <DateRangePicker
        timePicker
        locale={{ format: 'DD-MM-YYYY h:mm A' }}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        ranges={this.state.ranges}
        onEvent={(event, picker) => this.handleEvent(event, picker)}
      >
        <Button className="selected-date-range-btn" style={{ width: '100%' }}>
          <div className="pull-left"><Glyphicon glyph="calendar" /></div>
          <div className="pull-right">
            <span>
              {label}
            </span>
            <span className="caret"></span>
          </div>
        </Button>
      </DateRangePicker>
    );
  }
}
