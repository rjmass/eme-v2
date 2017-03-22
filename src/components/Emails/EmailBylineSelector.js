import React, { Component } from 'react';
import { Col, ControlLabel, FormGroup } from 'react-bootstrap';
import DateTime from 'react-datetime';
import moment from 'moment';
import Select from 'react-select';
import renderTemplate from 'helpers/renderTemplate';

import bylineTemplate from './templates/byline.html';

export default class EmailBylineSelector extends Component {
  get authors() {
    const { authors } = this.props;
    return authors.map((a) => ({
      label: a.name,
      value: a
    }));
  }

  isValidDate(dt) {
    return dt >= (moment().startOf('day'));
  }

  // handleDateSelect(dt) {
  // }

  handleAuthorChange(au) {
    const { onChange } = this.props;
    const author = {
      selected: au.value,
      htmlBody: renderTemplate(bylineTemplate, au.value)
    };
    onChange(author);
  }

  render() {
    const { value } = this.props;
    const selectedAuthor = {
      label: value.selected && value.selected.name,
      value: value.selected && value.selected
    };
    return (
      <FormGroup>
        <Col sm={6}>
          <ControlLabel>Author</ControlLabel>
          <Select
            name="author-select"
            placeholder="Author..."
            options={this.authors}
            autosize={false}
            value={selectedAuthor.value && selectedAuthor}
            onChange={(a) => this.handleAuthorChange(a)}
          />
        </Col>
        <Col sm={6}>
          <ControlLabel>Send Date</ControlLabel>
          <DateTime
            defaultValue={new Date()}
            dateFormat="LL"
            timeFormat={false}
            isValidDate={this.isValidDate}
            onChange={(_date) => this.handleDateSelect(_date)}
          />
        </Col>
      </FormGroup>
    );
  }
}
