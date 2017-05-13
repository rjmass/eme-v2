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

  handleDateSelect(field, date) {
    const { onChange } = this.props;
    const sendDate = date.format('LL');
    const newValue = { ...field.selected.value, sendDate };
    const author = {
      sendDate,
      htmlBody: renderTemplate(bylineTemplate, newValue)
    };
    onChange(author);
  }

  handleAuthorChange(field, selected) {
    const { onChange } = this.props;
    const author = { selected: null, htmlBody: '' };
    if (selected) {
      const newValue = { ...selected.value };
      newValue.sendDate = field.sendDate || '';
      author.selected = selected;
      author.htmlBody = renderTemplate(bylineTemplate, newValue);
    }
    onChange(author);
  }

  render() {
    const { value } = this.props;
    const selectedAuthor = {
      label: value.selected && value.selected.label,
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
            onChange={(selected) => this.handleAuthorChange(value, selected)}
          />
        </Col>
        {selectedAuthor.label &&
          <Col sm={6}>
            <ControlLabel>Send Date</ControlLabel>
            <DateTime
              defaultValue={new Date()}
              dateFormat="LL"
              timeFormat={false}
              isValidDate={this.isValidDate}
              onChange={(_date) => this.handleDateSelect(value, _date)}
            />
          </Col>
        }
      </FormGroup>
    );
  }
}
