import React, { Component } from 'react';
import { ModalDialog } from 'components/Modal';
import { Button, Checkbox } from 'react-bootstrap';

export default class EmailConfirmSaveDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alwaysSave: false
    };
  }

  toggleChecked() {
    this.setState({ alwaysSave: !this.state.alwaysSave });
  }

  handleConfirm() {
  }

  render() {
    const { show, autogeneratePlain, onCancel, onConfirm } = this.props;
    const text = autogeneratePlain ?
      'The plain text body of this email will be autogenerated from the html body' : '';
    return (
      <ModalDialog
        show={show}
        onHide={onCancel}
        title={'Do you want to save?'}
        text={text}
        buttons={[
          <span key={'autosave'} className="pull-left">
            <Checkbox
              checked={this.state.alwaysSave}
              onChange={() => this.toggleChecked()}
            >
              Always save without confirming
            </Checkbox>
          </span>,
          <Button key={'cancel'} onClick={onCancel}>Cancel</Button>,
          <Button
            key={'confirm'}
            bsStyle="primary"
            onClick={() => onConfirm(this.state.alwaysSave)}
          >
            Save
          </Button>
        ]}
      />
    );
  }
}