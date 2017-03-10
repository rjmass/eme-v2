import React from 'react';
import { Row, Col, FormControl, ControlLabel } from 'react-bootstrap';
import imageResize from 'helpers/imageResize';

const placeholder = 'http://placehold.it/250?text=select+image';

export default (props) => {
  const { image: { url = placeholder, alt },
    onResize,
    onRename,
    size: { width, height } } = props;
  const imageProvided = url !== placeholder;
  const resizedUrl = imageProvided
    ? imageResize({ url, width: 350, height: 350 })
    : url;

  const handleSizeChange = (event, dimension = 'width') => {
    onResize({ [dimension]: event.target.value });
  };

  const handleNameChange = (event) => {
    onRename(event.target.value);
  };

  return (
    <Row>
      <Col xs={4}>
        <img src={resizedUrl} alt={alt} />
      </Col>
      <Col xs={8}>
        {imageProvided &&
          <div className="pull-right">
            <ControlLabel>Alt text</ControlLabel>
            <FormControl
              defaultValue={alt}
              placeholder="Alternative text"
              onChange={(event) => handleNameChange(event)}
            />
            <ControlLabel>Width</ControlLabel>
            <FormControl
              defaultValue={width}
              placeholder="e.g. 350px"
              type="number"
              onChange={(event) => handleSizeChange(event)}
            />
            <ControlLabel>Height</ControlLabel>
            <FormControl
              defaultValue={height}
              placeholder="e.g. 350px"
              type="number"
              onChange={(event) => handleSizeChange(event, 'height')}
            />
          </div>}
      </Col>
    </Row>
  );
};
