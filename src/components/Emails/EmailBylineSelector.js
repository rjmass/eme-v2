import React, { Component } from 'react';
import { Checkbox, Button, Col, ControlLabel, FormGroup, FormControl } from 'react-bootstrap';

export default class EmailBylineSelector extends Component {
  get authors() {
    const { authors } = this.props;
    return authors.map((a, i) => (
      <option key={i} value={a}>
        {a.name}
      </option>
    ));
  }

  render() {
    const { onAuthorChange } = this.props;

    return (
      <div>
        <ControlLabel>Authors</ControlLabel>
        <FormControl
          componentClass="select"
          placeholder="limit..."
          value=""
          onChange={(e) => onAuthorChange({ limit: e.target.value })}
        >
          {this.authors}
        </FormControl>
      </div>
    );
  }
}
