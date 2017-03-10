import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { Button, FormControl, Row, Col, FormGroup, ControlLabel } from 'react-bootstrap';
import { imageUploadThunk } from 'redux/modules/images';

import './ImageForm.css';

@connect()
class ImageForm extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      name: ''
    };
  }

  dropHandler([file = null]) {
    const name = file ? file.name : '';
    this.setState({ file, name });
  }

  async uploadHandler() {
    const { file, name } = this.state;
    const { dispatch } = this.props;
    await dispatch(imageUploadThunk(file, name));
    this.resetForm();
  }

  resetForm() {
    this.dropHandler([]);
  }

  get uploadDisabled() {
    const { file, name } = this.state;
    const { uploading } = this.props;
    return uploading || (!file || !name);
  }

  render() {
    const { file, name } = this.state;
    const { uploading } = this.props;
    return (
      <Row>
        <Col xs={8}>
          <Dropzone
            onDrop={(f) => this.dropHandler(f)}
            multiple={false}
            className="drop-zone"
            activeClassName="active"
          >
            {file
              ? <img
                alt={file.name}
                src={file.preview}
              />
              : <span>
                <i className="fa fa-cloud-upload" />
                &nbsp; Drop image file here to upload..
              </span>}
          </Dropzone>
        </Col>
        <Col xs={2}>
          <FormGroup>
            <ControlLabel>File Name</ControlLabel>
            <FormControl
              type="text"
              value={name}
              placeholder="e.g. Grumpy cat"
              onChange={(e) => this.setState({ name: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Button
              bsStyle="warning"
              onClick={() => this.resetForm()}
              disabled={uploading || (!file & !name)}
            > Clear
            </Button>
            &nbsp;
            <Button

              bsStyle="success"
              onClick={() => this.uploadHandler()}
              disabled={this.uploadDisabled}
            > Upload
            </Button>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}

export default ImageForm;
