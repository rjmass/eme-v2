import React, { Component, PropTypes } from 'react';
import { Checkbox, Button, Col, ControlLabel, FormGroup, FormControl } from 'react-bootstrap';
import { QueryPicker } from 'components/NewsFeed';

export default class Capi extends Component {
  static propTypes = {
    onQueryAdd: PropTypes.func.isRequired,
    onQueryRemove: PropTypes.func.isRequired,
    onQueryChange: PropTypes.func.isRequired,
    onQueryActivate: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired
  }

  get queryTypes() {
    return ['CAPI']
      .map((q, i) => (
        <option key={i} value={q}>
          {q}
        </option>
      ));
  }

  get limits() {
    return (Array.from({ length: 10 }, (v, i) => i + 1))
      .map((l, i) => (
        <option key={i} value={`${l}DAYS`}>
          {l}
        </option>
      ));
  }

  render() {
    const { fields, onQueryActivate, onQueryChange, onQueryAdd, onQueryRemove } = this.props;

    return (
      <Col sm={12}>
        {fields.value && fields.value.list.length ?
          <Checkbox
            type="checkbox"
            checked={fields.value.activated}
            onChange={(e) => onQueryActivate(e.target.checked)}
          >
            <strong>Queries Active</strong>
          </Checkbox> : null}
        {fields.value && fields.value.list.map((q, i) => {
          return (
            <FormGroup key={i}>
              <Col sm={2}>
                <ControlLabel>Type</ControlLabel>
                <FormControl
                  componentClass="select"
                  value={q.type}
                  onChange={(e) => onQueryChange(i, { type: e.target.value })}
                >
                  {this.queryTypes}
                </FormControl>
              </Col>
              <Col sm={3}>
                <ControlLabel>Variable</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="name..."
                  value={q.variableName}
                  onChange={(e) => onQueryChange(i, { variableName: e.target.value })}
                />
              </Col>
              <Col sm={4}>
                <ControlLabel>Query</ControlLabel>
                <QueryPicker
                  value={q.query}
                  onSelect={(val) => onQueryChange(i, { query: val })}
                />
              </Col>
              <Col sm={2}>
                <ControlLabel>Days</ControlLabel>
                <FormControl
                  componentClass="select"
                  placeholder="limit..."
                  value={q.limit}
                  onChange={(e) => onQueryChange(i, { limit: e.target.value })}
                >
                  {this.limits}
                </FormControl>
              </Col>
              <Col sm={1}>
                <br />
                <span
                  style={{ cursor: 'pointer', color: '#8B0000' }}
                  onClick={() => onQueryRemove(i)}
                >
                  <i className="fa fa-times fa-2x" />
                </span>
              </Col>
            </FormGroup>
            );
        })}
        <div className="help-block" />
        <FormGroup className="pull-right">
          <Button onClick={() => onQueryAdd()}>Add</Button>
        </FormGroup>
      </Col>
    );
  }
}
