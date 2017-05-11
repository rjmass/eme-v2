import React, { PropTypes, Component } from 'react';
import { Alert } from 'react-bootstrap';

export default class Message extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['danger', 'info', 'warning']).isRequired
  }

  constructor(...params) {
    super(...params);
    this.styles = require('./Message.scss');
  }

  render() {
    const { text, type } = this.props;

    return (
      <Alert bsStyle={type}>
        <span>{text}</span>
      </Alert>
    );
  }
}
