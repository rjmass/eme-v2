import React, { Component, PropTypes } from 'react';
import { Button, Col, ControlLabel, FormGroup, FormControl } from 'react-bootstrap';

export default class Capi extends Component {
  static propTypes = {
    onAuthorAdd: PropTypes.func.isRequired,
    onAuthorRemove: PropTypes.func.isRequired,
    onAuthorUpdate: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired
  }

  render() {
    const { authors = [], onAuthorUpdate, onAuthorAdd, onAuthorRemove } = this.props;

    return (
      <Col sm={12}>
        {authors.map((a, i) => {
          return (
            <FormGroup key={i}>
              <Col sm={3}>
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Author name..."
                  value={a.name}
                  onChange={(e) => onAuthorUpdate(i, { name: e.target.value })}
                />
              </Col>
              <Col sm={4}>
                <ControlLabel>Photo URL</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Photo URL..."
                  value={a.photo}
                  onChange={(e) => onAuthorUpdate(i, { photo: e.target.value })}
                />
              </Col>
              <Col sm={4}>
                <ControlLabel>Author URL</ControlLabel>
                <FormControl
                  type="text"
                  placeholder="Author URL..."
                  value={a.authorURL}
                  onChange={(e) => onAuthorUpdate(i, { authorURL: e.target.value })}
                />
              </Col>
              <Col sm={1}>
                <br />
                <span
                  style={{ cursor: 'pointer', color: '#8B0000' }}
                  onClick={() => onAuthorRemove(i)}
                >
                  <i className="fa fa-times fa-2x" />
                </span>
              </Col>
            </FormGroup>
            );
        })}
        <div className="help-block" />
        <FormGroup className="pull-right">
          <Button onClick={() => onAuthorAdd()}>Add Author</Button>
        </FormGroup>
      </Col>
    );
  }
}
