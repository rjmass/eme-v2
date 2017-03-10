import React, { Component } from 'react';
import { Form, Row, FormGroup, Col, ControlLabel, FormControl, Button } from 'react-bootstrap';
import QueryPicker from './QueryPicker';

export default class ArticleSearchForm extends Component {

  get searchDisabled() {
    const { limit, query } = this.props;
    return !limit || !query;
  }

  render() {
    const { query, limit, onLimitSelect,
      onQuerySelect, onSearch, onSaveQuery } = this.props;
    const limits
    = (Array.from({ length: 31 }, (v, i) => i + 1))
        .map((l, i) => (
          <option key={i} value={`${l}DAYS`}>
            {l}
          </option>
        ));
    return (
      <Form>
        <Row>
          <FormGroup>
            <Col xs={8}>
              <ControlLabel>Query</ControlLabel>
              <QueryPicker
                value={query}
                onSelect={(q) => onQuerySelect(q)}
                onCustomSearch={(q) => onSearch(q)}
                onSaveQuery={(q) => onSaveQuery(q)}
              />
            </Col>
            <Col xs={2}>
              <ControlLabel>Days</ControlLabel>
              <FormControl
                componentClass="select"
                placeholder="limit"
                defaultValue={limit}
                onChange={(evt) => onLimitSelect(evt.target.value)}
              >
                {limits}
              </FormControl>
            </Col>
            <Col xs={2}>
              <ControlLabel>&nbsp;</ControlLabel>
              <div>
                <Button
                  bsStyle="success"
                  disabled={this.searchDisabled}
                  onClick={() => onSearch()}
                  className="pull-right"
                >
                  Search
                </Button>
              </div>
            </Col>
          </FormGroup>
        </Row>
      </Form>
    );
  }
}
