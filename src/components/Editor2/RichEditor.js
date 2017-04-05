import React, { Component } from 'react';
import editorConfig from './editorConfig';
import config from 'config';
import EditorOverrides from './plugins/ckeditor.overrides';
import FtFormat from './plugins/ckeditor.ftformat';
import InsertImage from './InsertImage';

export default class HtmlEditor extends Component {

  componentDidMount() {
    EditorOverrides.load();
    FtFormat.load();
    const conf = editorConfig(config);
    this._editor = window.CKEDITOR.replace('editor', conf);
    this._editor.on('instanceReady', () => {
      this.ready(this._editor);
    });
    this._editor.on('change', () => {
      const data = this._editor.getData();
      this.props.onChange(data);
    });
    this.applyAddons(this._editor);
  }

  componentWillUnmount() {
    this._editor.destroy();
  }

  ready(instance) {
    let canChange = true;
    const initIfEmpty = () => {
      const EMPTY_DATA = '<p><br></p>';
      // eslint-disable-next-line
      const NORMAL_DATA = '<p style="font-family:Arial;margin:0px 0px 30px;font-size:16px;line-height:23px;"></p>';
      const data = instance.getSnapshot();
      if (data === EMPTY_DATA && canChange) {
        canChange = false;
        instance.setData(NORMAL_DATA, () => {
          canChange = true;
        });
      }
    };

    instance.on('change', initIfEmpty);
    instance.on('focus', initIfEmpty);
  }

  applyAddons(instance) {
    EditorOverrides.alwaysBlankLinkOnPaste(instance);
    EditorOverrides.alwaysNormalParagraphOnPaste(instance);
  }

  handleImageSelect(img) {
    if (!this._editor.focusManager.hasFocus) {
      this._editor.focus();
      // to allow cursor to set in editor
      setTimeout(() => {
        this._editor.insertHtml(img);
      }, 100);
    } else {
      this._editor.insertHtml(img);
    }
  }

  render() {
    return (
      <div>
        <InsertImage
          onInsert={(img) => this.handleImageSelect(img.body)}
        />
        <textarea name="editor" cols="50" rows="50" defaultValue={this.props.value}></textarea>
      </div>
    );
  }
}
