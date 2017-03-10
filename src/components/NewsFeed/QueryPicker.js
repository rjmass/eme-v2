import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getQueries, queriesLoadThunk } from 'redux/modules/queries';
import { Button, FormGroup, Row, Col } from 'react-bootstrap';

@connect((state) => ({ list: getQueries(state.queries) }))
class QueryPicker extends Component {
  constructor() {
    super();
    this.state = {
      input: ''
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(queriesLoadThunk());
  }

  get noResultAdd() {
    const { onCustomSearch, onSaveQuery } = this.props;
    const { input } = this.state;
    return (
      <div className="query-add-dropdown">
        <Row>
          <Col xs={12}>
            <FormGroup>
              {onCustomSearch && <Button
                bsSize="xsmall"
                bsStyle="warning"
                onClick={() => onCustomSearch(input)}
              > Custom Search
              </Button>}
                &nbsp;
              {onSaveQuery && <Button
                bsSize="xsmall"
                bsStyle="success"
                className="pull-right"
                onClick={() => onSaveQuery(input)}
              >
                Save
              </Button>}
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { onSelect, list, value } = this.props;
    const options = list
      .map((query) => ({
        label: query.name,
        value: query.query
      }));
    return (
      <Select
        value={value}
        options={options}
        name="query-picker"
        noResultsText={this.noResultAdd}
        autosize={false}
        onInputChange={(input) => this.setState({ input })}
        placeholder={`Select a query.. (${options.length})`}
        onChange={(option) => onSelect(option && option.value)}
        autosize={false}
        {...this.props}
      />
    );
  }
}

export default QueryPicker;
