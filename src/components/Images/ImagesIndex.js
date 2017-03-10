import { Row, Col } from 'react-bootstrap';
import {
  imagesLoadThunk,
  getImages,
  imagesFilter,
  imagesSort } from 'redux/modules/images';
import React, { Component } from 'react';
import ImagesList from './ImagesList';
import ImageForm from './ImageForm';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { pager } from 'decorators';
import listSorter from 'helpers/listSorter';

@pager(18)
class ImagesIndex extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(imagesLoadThunk());
  }

  handleFilter(filter) {
    const { dispatch } = this.props;
    dispatch(imagesFilter(filter));
  }

  handleSort(key) {
    const { dispatch } = this.props;
    dispatch(imagesSort({ sortFunc: listSorter, key }));
  }

  render() {
    const { images, list } = this.props;
    const { page, pageSize } = this.state;
    const totalCount = list.length;
    const uploading = images.isUploading;

    return (
      <Row>
        <Col xs={12}>
          <div className="help-block" />
          <ImageForm
            uploading={uploading}
          />
        </Col>

        <Col xs={12}>
          <ImagesList
            list={this.getCurrentPageList()}
            sort={images.sort}
            totalCount={totalCount}
            filter={images.filter}
            onFilter={(filter) => this.handleFilter(filter)}
            onSort={(key) => this.handleSort(key)}
            page={page}
            perPage={pageSize}
            onPageChange={(p) => this.handlePageChange(p)}
          />
        </Col>
      </Row>
    );
  }
}

const images = state => state.images;
const list = createSelector(images, getImages);

@connect((state) => ({ images: state.images, list: list(state) }))
export default class ImagesIndexConnected extends ImagesIndex { }
