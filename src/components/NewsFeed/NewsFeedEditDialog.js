import React, { Component } from 'react';
import { ModalDialog } from 'components/Modal';
import { Button, FormControl } from 'react-bootstrap';

export default class NewsFeedItemEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      summary: props.summary || ''
    };
  }

  handleChange(field, value) {
    this.setState({ [field]: value });
  }

  render() {
    const { show, title, summary, onCancel, onConfirm } = this.props;
    return (
      <ModalDialog
        show={show}
        onHide={onCancel}
        title={'Confirm Edit'}
        text={
          <div>
            <FormControl
              type="text"
              placeholder="Article title..."
              defaultValue={title}
              onChange={(e) => this.handleChange('title', e.target.value)}
            />
            <div className="help-block" />
            <FormControl
              componentClass="textarea"
              placeholder="Article summary..."
              defaultValue={summary}
              onChange={(e) => this.handleChange('summary', e.target.value)}
            />
          </div>
          }
        buttons={[
          <Button key={'cancel'} onClick={onCancel}>Cancel</Button>,
          <Button
            key={'confirm'}
            bsStyle="primary"
            onClick={() => onConfirm(this.state.title, this.state.summary)}
          >
            Save
          </Button>
        ]}
      />
    );
  }
}
