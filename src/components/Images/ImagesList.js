import React from 'react';
import { BaseList } from 'components/Base';
import ImageItem from './ImageItem';

import './Image.css';

const renderItem = (image) => <ImageItem image={image} key={image.Key} />;

export default class ImagesList extends BaseList {

  get renderItem() {
    return super.renderItem
      || renderItem;
  }
}
