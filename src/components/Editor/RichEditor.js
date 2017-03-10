import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import Editor from './Editor';
import InsertContentArea from './InsertContentArea';
import { SnippetPicker } from 'components/Snippets';
import { NewsPicker } from 'components/NewsFeed';
import HtmlToPlain from './HtmlToPlain';
import InsertImage from './InsertImage';

class RichEditor extends Component {

  static propTypes = {
    html: PropTypes.bool,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  handleOnSnippetSelect(snippet) {
    const { editor } = this;
    const { onChange } = this.props;
    const value = editor.getValue();
    const cursor = editor.selection.getCursor();
    const index = editor.session.doc.positionToIndex(cursor);
    const newValue = `${value.substr(0, index)}${snippet.body}${value.substr(index)}`;
    onChange(newValue);
  }

  handleBodyReplace(text) {
    const { onChange } = this.props;
    onChange(text);
  }

  render() {
    const {
      name,
      value,
      onChange,
      html = true,
      snippets = true,
      articles = true,
      contentArea = false,
      fromHtmlSource = false,
      fromHtmlFields = {},
      images = true,
    } = this.props;

    const editorProps = {
      theme: 'xcode',
      mode: 'html',
      height: '300px',
      width: '100%',
      showPrintMargin: false
    };

    return (
      <div className="rich-editor">
        <div className="help-block" />
        <Row>
          {snippets && <Col xs={8}>
            <SnippetPicker
              html={html}
              onSelect={(snippet) => this.handleOnSnippetSelect(snippet)}
            />
          </Col>}

          {images && <Col xs={1}>
            <InsertImage
              onInsert={(snippet) => this.handleOnSnippetSelect(snippet)}
            />
          </Col>}

          {contentArea && <Col xs={1}>
            <InsertContentArea
              currentHTMLBody={value}
              onInsert={(snippet) => this.handleOnSnippetSelect(snippet)}
            />
          </Col>}

          {articles && <Col xs={1}>
            <NewsPicker
              onInsert={(snippet) => this.handleOnSnippetSelect(snippet)}
            />
          </Col>}

          {fromHtmlSource && <Col xs={1}>
            <HtmlToPlain
              html={fromHtmlSource}
              fields={fromHtmlFields}
              onInsert={(plain) => this.handleBodyReplace(plain)}
            />
          </Col>}
        </Row>
        <div className="help-block" />
        <Editor
          name={name}
          value={value}
          onChange={(val) => onChange(val)}
          onLoad={(editor) => { this.editor = editor; }}
          {...editorProps}
        />
      </div>
    );
  }
}

export default RichEditor;
