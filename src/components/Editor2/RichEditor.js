import React, { Component } from 'react';
import editorConfig from './editorConfig';
import config from 'config';
import EditorOverrides from './plugins/ckeditor.overrides';
import FtFormat from './plugins/ckeditor.ftformat';

export default class HtmlEditor extends Component {

  componentDidMount() {
    EditorOverrides.load();
    FtFormat.load();
    const conf = editorConfig(config);
    this._editor = window.CKEDITOR;
    const instance = this._editor.replace('editor', conf);
    instance.on('instanceReady', () => {
      this.ready(instance);
    });
    instance.on('change', () => {
      const data = instance.getData();
      this.props.onChange(data);
    });
    this.applyAddons(instance);
  }

  componentWillUnmount() {
    this._editor.instances.editor.destroy();
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
    EditorOverrides.addImageProxy(instance);
  }

  render() {
    return (
      <textarea name="editor" cols="50" rows="50" defaultValue={this.props.value}></textarea>
    );
  }
}
