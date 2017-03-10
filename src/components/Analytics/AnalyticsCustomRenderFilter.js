import React, { Component, PropTypes } from 'react';

export default class AnalyticsCustomRenderFilter extends Component {
  static propTypes: {
    onChange: PropTypes.func.isRequired
  }

  constructor(...params) {
    super(...params);
    this.state = {
      filterTerm: ''
    };
  }

  filterValues() {
    return true;
  }

  handleChange(e) {
    const filters = e.target.value;
    this.setState({ filterTerm: filters });
    this.props.onChange({
      filterTerm: (filters.length > 0 ? filters : null),
      column: this.props.column,
      rawValue: filters,
      filterValues: this.filterValues
    });
  }

  renderInput() {
    const inputKey = `header-filter-${this.props.column.key}`;
    return (
      <input
        key={inputKey}
        type="text"
        className="form-control input-sm"
        placeholder="Search"
        value={this.state.filterTerm}
        onChange={(e) => this.handleChange(e)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="form-group">
          {this.renderInput()}
        </div>
      </div>
    );
  }
}
