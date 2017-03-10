import React from 'react';
import { Col, Image } from 'react-bootstrap';
import imageResize from 'helpers/imageResize';
import moment from 'moment';

const noop = () => { };

export default (props) => {
  const { image: { name, url },
    key,
    image,
    onSelect = noop,
    small = false } = props;
  const selectable = (onSelect !== noop);
  const thumbnailClass = selectable ? 'image-selectable' : '';
  const wrapperClass = small ? 'image-wrap-small' : 'image-wrap';
  const width = small ? 50 : 250;
  const resizedUrl = imageResize({ url, width, height: width });
  const atMoment = image.LastModified ?
    moment(new Date(`${image.LastModified}`)).format('Do MMM YYYY h:mma') : '';
  return (
    <Col xs={3} md={2} key={key}>
      <div className={`image-thumbnail ${thumbnailClass}`} onClick={() => onSelect(image)}>
        <div className={wrapperClass}>
          <Image src={resizedUrl} />
        </div>
        <div className="image-label">
          {name}
          <br></br>
          <span className="image-smaller-font">{atMoment}</span>
        </div>
      </div>
    </Col>
  );
};
