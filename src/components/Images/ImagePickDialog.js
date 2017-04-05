import React, { Component } from 'react';
import { connect } from 'react-redux';
import { imagesLoadThunk, getImages, imagesFilter } from 'redux/modules/images';
import { Modal, Button, Tabs, Tab } from 'react-bootstrap';
import imageResize from 'helpers/imageResize';
import ImageResizer from './ImageResizer';
import ImagesList from './ImagesList';
import ImageItem from './ImageItem';
import { pager, tabs } from 'decorators';

import './ImagePickDialog.css';

@pager(18)
@tabs('find')
class ImagePickDialog extends Component {
  constructor() {
    super();
    this.state = {
      image: {},
      size: { width: 350 }
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(imagesLoadThunk());
  }

  get insertEnabled() {
    const { tab, image: { url }, size: { width, height } } = this.state;
    return (tab === 'resize')
      && url
      && (parseInt(width, 10) || parseInt(height, 10));
  }

  handleInsert() {
    const realWidth = 800;
    const { onHide, onInsert } = this.props;
    const { image, size: { width, height } } = this.state;
    const wrappedUrl = imageResize({ url: image.url, width: realWidth });
    const widthAttr = width ? `width="${width}"` : '';
    const heightAttr = height ? `height="${height}"` : '';
    const styleAttr = 'style="margin:0; padding:0; border:none; display:block;"';
    // eslint-disable-next-line
    const snippet = `\n<img src="${wrappedUrl}" ${widthAttr} ${heightAttr} ${styleAttr} border="0" alt="${image.alt}">\n`;
    onInsert(snippet);
    onHide();
  }

  handleFilter(filter) {
    const { dispatch } = this.props;
    dispatch(imagesFilter(filter));
  }

  handleImageSelect(image) {
    const tab = 'resize';
    image.alt = image.name;
    this.setState({ image, tab });
  }

  handleSizeChange(size) {
    this.setState({ size });
  }

  handleNameChange(alt) {
    const image = this.state.image;
    image.alt = alt;
    this.setState({ image });
  }

  renderItem(image) {
    return (
      <ImageItem
        image={image}
        small
        onSelect={() => this.handleImageSelect(image)}
      />
    );
  }

  render() {
    const { show, onHide, images } = this.props;
    const { page, pageSize, image, tab: activeTab, size } = this.state;
    const { list } = this.props;
    const totalCount = list.length;

    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Select image to insert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            id="newsfeed-tabs"
            activeKey={activeTab}
            onSelect={(tab) => this.handleTabSelect(tab)}
          >
            <Tab eventKey="find" title="Find images">
              <div className="image-list-wrapper">
                <ImagesList
                  onFilter={(filter) => this.handleFilter(filter)}
                  onPageChange={(p) => this.handlePageChange(p)}
                  renderItem={(img) => this.renderItem(img)}
                  list={this.getCurrentPageList()}
                  totalCount={totalCount}
                  filter={images.filter}
                  perPage={pageSize}
                  page={page}
                />
              </div>
            </Tab>
            <Tab eventKey="resize" title="Resize">
              <div className="image-selection">
                <ImageResizer
                  image={image}
                  size={size}
                  onResize={(s) => this.handleSizeChange(s)}
                  onRename={(alt) => this.handleNameChange(alt)}
                />
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button
            key="cancel"
            onClick={() => onHide()}
          >
            Cancel
          </Button>
          <Button
            bsStyle="primary"
            disabled={!this.insertEnabled}
            onClick={() => this.handleInsert()}
          >
            Insert
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

@connect((state) => ({ list: getImages(state.images), images: state.images }))
export default class ImagePickDialogConnected extends ImagePickDialog { }
