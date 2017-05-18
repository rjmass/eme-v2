import React, { Component } from 'react';
import { Col, Row, ControlLabel, FormGroup, FormControl } from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';
import DateTime from 'react-datetime';
import moment from 'moment';
import Select from 'react-select';
import debounce from 'lodash/debounce';
import renderTemplate from 'helpers/renderTemplate';

import bylineTemplate from './templates/byline.html';
import './EmailBylineSelector.css';

export default class EmailBylineSelector extends Component {
  constructor(props) {
    super(props);
    this.handleToggleGuest =
      debounce((field) => this._handleToggleGuest(field), 500, { leading: true });
  }

  shouldComponentUpdate(nextProps) {
    return (!(nextProps.value === this.props.value));
  }

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

  _handleToggleGuest(field) {
    const { onChange } = this.props;
    const author = {};
    const guestVal = field.selected && { ...field.selected.value } || {};
    guestVal.sendDate = field.sendDate || '';
    if (!field.guest) {
      guestVal.photo = '';
      guestVal.authorURL = '';
      author.guest = { name: guestVal.name, photo: '', authorURL: '' };
      author.htmlBody = renderTemplate(bylineTemplate, guestVal);
    } else {
      author.guest = null;
      author.htmlBody = renderTemplate(bylineTemplate, guestVal);
    }
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

  handleGuestChange(field, guest) {
    const { onChange } = this.props;
    const author = {};
    const newValue = { ...field.guest, ...guest };
    newValue.sendDate = field.sendDate || '';
    author.guest = guest;
    author.htmlBody = renderTemplate(bylineTemplate, newValue);
    onChange(author);
  }

  render() {
    const { value } = this.props;
    const defaultAuthors = !value.guest;
    const selectedAuthor = {
      label: value.selected && value.selected.label,
      value: value.selected && value.selected
    };
    return (
      <div>
        <Row>
          <Col xs={12}>
            <FormGroup>
              <Col sm={2} md={3} lg={3}>
                <ControlLabel>Default</ControlLabel>
                <Switch
                  value={defaultAuthors}
                  wrapperClass="bootstrap-switch-byline"
                  onChange={() => this.handleToggleGuest(value)}
                />
              </Col>
              <Col sm={5} md={5} lg={5}>
                <ControlLabel>Author</ControlLabel>
                {defaultAuthors
                  ? <Select
                    name="author-select"
                    placeholder="Author..."
                    options={this.authors}
                    autosize={false}
                    value={selectedAuthor.value && selectedAuthor}
                    onChange={(selected) => this.handleAuthorChange(value, selected)}
                  />
                  : <FormControl
                    type="text"
                    placeholder="Name"
                    onChange={(e) => this.handleGuestChange(value, e.target.value)}
                  />}
              </Col>
                {!defaultAuthors || selectedAuthor.label &&
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
          </Col>
        </Row>
        {!defaultAuthors && <Row>
          <Col xs={12}>
            <FormGroup>
              <Col xs={8}>
                <ControlLabel>Author URL</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Author URL"
                  onChange={() => {}}
                />
              </Col>
            </FormGroup>
          </Col>
        </Row>
        }
      </div>
    );
  }
}
