import React, { Component, PropTypes } from 'react';
import { HelpBlock, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { createWrapper } from 'components/Preview/previewContent';
import { ModalDialog } from 'components/Modal';

class InsertContentAreaDialog extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    onInsert: PropTypes.func.isRequired,
    currentHTMLBody: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    const currentContentAreas = this.extractContentAreaNames();
    this.state = {
      value: '',
      validationState: null,
      help: '',
      insertDisabled: true,
      currentContentAreas
    };
  }

  extractContentAreaNames() {
    const currentHTMLBody = createWrapper(this.props.currentHTMLBody);
    const contentAreas = [...currentHTMLBody.querySelectorAll('content')];
    return contentAreas.map(area => area.attributes.name.value);
  }

  validateInput(value = '') {
    if (this.state.currentContentAreas.includes(value)) {
      this.setState({
        value,
        validationState: 'error',
        help: 'Content name already exists',
        insertDisabled: true
      });
    } else {
      this.setState({ value, validationState: null, help: '', insertDisabled: false });
    }
  }

  handleInputChange({ target: { value } }) {
    this.validateInput(value);
  }

  handleClick() {
    const { value } = this.state;
    const body = `\n<div>\n\t<content name="${value}"></content>\n</div>\n`;
    this.props.onInsert({ body });
  }

  render() {
    const { validationState, help } = this.state;
    const { show, onHide } = this.props;
    return (
      <ModalDialog
        show={show}
        onHide={onHide}
        title="Insert Content Area"
        text={
          <FormGroup
            controlId="contentArea"
            validationState={validationState}
            help={help}
          >
            <ControlLabel>Area Name:</ControlLabel>
            <FormControl onChange={(value) => this.handleInputChange(value)} />
            {help && <HelpBlock>{help}</HelpBlock>}
          </FormGroup>}
        buttons={[
          <Button key={'cancel'} onClick={onHide}>Cancel</Button>,
          <Button
            key={'insert'}
            bsStyle="primary"
            onClick={() => this.handleClick()}
            disabled={this.state.insertDisabled}
          >
            Insert
          </Button>
        ]}
      />
    );
  }
}

export default InsertContentAreaDialog;
