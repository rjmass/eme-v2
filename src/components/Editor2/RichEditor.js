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
    instance.on('change', () => {
      const data = instance.getData();
      this.props.onChange(data);
    });
    this.applyAddons(instance);
  }

  componentWillUnmount() {
    this._editor.instances.editor.destroy();
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
