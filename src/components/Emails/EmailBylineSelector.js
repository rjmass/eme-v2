import React, { Component } from 'react';
import { Col, ControlLabel, FormGroup } from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';
import DateTime from 'react-datetime';
import moment from 'moment';
import Select from 'react-select';
import renderTemplate from 'helpers/renderTemplate';

import bylineTemplate from './templates/byline.html';
import './EmailBylineSelector.css';

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
        <Col sm={2} md={3} lg={3}>
          <ControlLabel>Default</ControlLabel>
          <Switch
            wrapperClass="bootstrap-switch-byline"
            state
            onChange={() => {}}
          />
        </Col>
        <Col sm={5} md={5} lg={5}>
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
          <Col sm={5} md={4} lg={4}>
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
