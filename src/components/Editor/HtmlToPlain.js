import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { replaceCustomTags } from '../Preview/previewContent';
import plainTextConverter from 'helpers/plainTextConverter';

class HtmlToPlain extends Component {

  importHandler() {
    const { html, fields, onInsert } = this.props;
    const htmlWithFields = replaceCustomTags(html, fields);
    const plainBody = plainTextConverter(htmlWithFields);
    onInsert(plainBody);
  }

  render() {
    return (
      <Button
        onClick={() => this.importHandler()}
      >
        <i className="fa fa-code" /> From HTML..
      </Button>
    );
  }
}

export default HtmlToPlain;
