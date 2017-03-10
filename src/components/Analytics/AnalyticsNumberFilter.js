import React, { Component } from 'react';
const Ruconstype = {
  Number: 1,
  Range: 2,
  GreaterThen: 3,
  LessThen: 4
};

export default class NumericFilter extends Component {
  constructor(...params) {
    super(...params);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.getRules = this.getRules.bind(this);
  }

  getRules(value) {
    const rules = [];
    if (value === '') {
      return rules;
    }
    // check comma
    const list = value.split(',');
    if (list.length > 0) {
      // handle each value with comma
      for (const key of Object.keys(list)) {
        const obj = list[key];
        if (obj.indexOf('-') > 0) { // handle dash
          const begin = parseFloat(obj.split('-')[0], 10);
          const end = parseFloat(obj.split('-')[1], 10);
          rules.push({ type: Ruconstype.Range, begin, end });
        } else if (obj.indexOf('>') > -1) { // handle greater then
          const begin = parseFloat(obj.split('>')[1], 10);
          rules.push({ type: Ruconstype.GreaterThen, value: begin });
        } else if (obj.indexOf('<') > -1) { // handle less then
          const end = parseFloat(obj.split('<')[1], 10);
          rules.push({ type: Ruconstype.LessThen, value: end });
        } else { // handle normal values
          const numericValue = parseFloat(obj, 10);
          rules.push({ type: Ruconstype.Number, value: numericValue });
        }
      }
    }
    return rules;
  }


  filterValues(row, columnFilter, columnKey) {
    if (columnFilter.filterTerm == null) {
      return true;
    }
    let result = false;
    // implement default filter logic
    const cellValue = row[columnKey];
    const rawValue = typeof cellValue === 'object' ? cellValue.props.value : cellValue;
    const value = parseFloat(rawValue, 10);
    for (const ruleKey of Object.keys(columnFilter.filterTerm)) {
      const rule = columnFilter.filterTerm[ruleKey];

      switch (rule.type) {
        case Ruconstype.Number:
          if (rule.value === value) {
            result = true;
          }
          break;
        case Ruconstype.GreaterThen:
          if (rule.value < value) {
            result = true;
          }
          break;
        case Ruconstype.LessThen:
          if (rule.value > value) {
            result = true;
          }
          break;
        case Ruconstype.Range:
          if (rule.begin <= value && rule.end >= value) {
            result = true;
          }
          break;
        default:
          // do nothing
          break;
      }
    }
    return result;
  }

  handleKeyPress(e) { // Validate the input
    const result = />|<|-|,|\.|[0-9]/.test(e.key);
    if (!result) {
      e.preventDefault();
    }
  }

  handleChange(e) {
    const value = e.target.value;
    const filters = this.getRules(value);
    this.props.onChange({
      filterTerm: (filters.length > 0 ? filters : null),
      column: this.props.column,
      rawValue: value,
      filterValues: this.filterValues
    });
  }

  render() {
    const inputKey = `header-filter-${this.props.column.key}`;
    return (
      <div>
        <div>
          <input
            key={inputKey}
            type="text"
            placeholder="5, 2-7, >9"
            className="form-control input-sm"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
          />
        </div>
      </div>
    );
  }
}
