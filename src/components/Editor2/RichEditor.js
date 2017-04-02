import React, { Component } from 'react';

export default class HtmlEditor extends Component {

  componentDidMount() {
    const configuration = {
      toolbar: 'Basic'
    };
    console.log(window.CKEDITOR);
    // Need to use window.CKEDITOR and load this instead
    window.CKEDITOR.replace('editor', configuration);
    window.CKEDITOR.instances.editor.on('change', () => {
      const data = window.CKEDITOR.instances.editor.getData();
      this.props.onChange(data);
    });
  }

  render() {
    return (
      <textarea name="editor" cols="50" rows="50" defaultValue={this.props.value}></textarea>
    );
  }

}
