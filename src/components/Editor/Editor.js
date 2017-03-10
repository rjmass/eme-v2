import AceEditor from 'react-ace';

import 'brace/mode/html';
import 'brace/theme/xcode';
import 'brace/ext/searchbox';

import './Editor.css';

export default class HtmlEditor extends AceEditor {

  componentWillReceiveProps(nextProps) {
    const pos = this.editor.session.selection.toJSON();
    super.componentWillReceiveProps(nextProps);
    this.editor.session.selection.fromJSON(pos);
  }

}
