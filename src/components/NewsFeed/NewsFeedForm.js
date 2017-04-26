import React, { Component } from 'react';
import { Form, FormGroup, Button } from 'react-bootstrap';

export default class NewsFeedForm extends Component {
  render() {
    return (
      <FormGroup className="list-group-item list-group-item-info">
        <Button>
          Remove all
        </Button>
        <Button className="pull-right">
          Add..
        </Button>
      </FormGroup>
    );
  }
}
