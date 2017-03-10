import { Button } from 'react-bootstrap';
import React, { Component } from 'react';

export default class CustomNotif extends Component {
  render() {
    const { message, kind } = this.props;
    const notifTheme = {
      info: 'meme-notification-info',
      success: 'meme-notification-success',
      warning: 'meme-notification-warning',
      danger: 'meme-notification-danger'
    };
    return (
      <Button className={`meme-notifications ${notifTheme[kind]}`}>
        {message}
      </Button>
    );
  }
}
