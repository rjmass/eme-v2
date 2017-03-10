import React, { Component } from 'react';
import Frame from 'react-frame-component';
import initialContent from './templates/iframe.html';
import Resizable from 'react-resizable-box';
import './HtmlPreview.css';

export default class HtmlPreview extends Component {
  render() {
    const { body } = this.props;
    const htmlBody = { __html: body };
    return (
      <Resizable
        height={750}
        width={'auto'}
        isResizable={{
          top: false,
          right: false,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false
        }}
        handleStyle={{
          bottom: {
            position: 'absolute',
            width: '30px',
            cursor: 'row-resize',
            height: '30px',
            bottom: '0px',
            right: '0px'
          }
        }}
      >
        <div className="resize-box">
          <i className="fa fa-arrows-v fa-2x resize-icon" />
          <Frame
            className="preview-frame"
            initialContent={initialContent}
            mountTarget="#contents"
          >
            <div dangerouslySetInnerHTML={htmlBody} />
          </Frame>
        </div>
      </Resizable>
    );
  }
}
