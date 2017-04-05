export default class EditorOverrides {

  static get IMG_WIDTH() {
    return 1024;
  }

  static get IMG_VISIBLE_WIDTH() {
    return 350;
  }

  static load() {
    EditorOverrides.alwaysBlankLinkInDialog();
    EditorOverrides.noAnchorLink();
  }

  static alwaysBlankLinkInDialog() {
    let element = { items: [] };
    window.CKEDITOR.on('dialogDefinition', (e) => {
      // for a link
      if (e.data.name === 'link') {
        const target = e.data.definition.getContents('target');
        element = target.get('linkTargetType');
      }
      // for an image
      if (e.data.name === 'image') {
        const target = e.data.definition.getContents('Link');
        element = target.get('cmbTarget');
      }

      const options = element.items;
      for (let i = options.length - 1; i >= 0; i--) {
        const [label] = options[i];
        if (!label.match(/new window/i)) {
          options.splice(i, 1);
        }
      }
      element.default = '_blank';
    });
  }

  static noAnchorLink() {
    let element = { items: [] };

    window.CKEDITOR.on('dialogDefinition', (e) => {
      if (e.data.name === 'link') {
        const target = e.data.definition.getContents('info');
        element = target.get('linkType');
      }
      const options = element.items;

      for (let i = options.length - 1; i >= 0; i--) {
        const value = options[i][1];
        if (value.match(/anchor/i)) {
          options.splice(i, 1);
        }
      }
    });
  }

  static alwaysBlankLinkOnPaste(editor) {
    editor.on('paste', (event) => {
      const $div = document.createElement('div');
      $div.innerHTML = event.data.dataValue;
      const link = $div.getElementsByTagName('a')[0];
      if (link) {
        link.setAttribute('target', '_blank');
      }
      event.data.dataValue = $div.innerHTML;
    });
  }

  static alwaysNormalParagraphOnPaste(editor) {
    editor.on('paste', (event) => {
      const $div = document.createElement('div');
      $div.innerHTML = event.data.dataValue;
      const para = $div.getElementsByTagName('p')[0];
      if (para) {
        para.setAttribute('style', 'font-family:arial;font-size:16px;line-height:23px;margin:0px 0px 30px;');
      }
      event.data.dataValue = $div.innerHTML;
    });
  }
}
