import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, FormGroup, ControlLabel, Button, Row, Col } from 'react-bootstrap';
import { sendLoaded } from 'redux/modules/send';
import DateTime from 'react-datetime';
import Switch from 'react-bootstrap-switch';
import moment from 'moment';
import momentTz from 'moment-timezone';
import TimezonePicker from './TimezonePicker';

import 'font-awesome-animation/dist/font-awesome-animation.min.css';
import 'react-datetime/css/react-datetime.css';
import './EmailSendDialog.css';

class EmailSendDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listId: null,
      now: true,
      date: moment(),
      tz: this.defaultTz
    };
  }

  get defaultTz() {
    return momentTz.tz.guess() || 'Europe/London';
  }

  handleSwitchToggle(now) {
    this.setState({ now });
  }

  handleDateTimeSelect(date) {
    const currentDate = moment();
    const momentVersion = moment(date);
    if (!momentVersion.isValid()
      || momentVersion < currentDate
      || momentVersion > (moment().add(30, 'days'))) {
      date = currentDate;
    } else {
      date = momentVersion;
    }
    this.setState({ date });
  }

  handleTZSelect(tz) {
    tz = tz || this.defaultTz;
    this.setState({ tz });
  }

  handleListSelect(listId) {
    this.setState({ listId });
  }

  isValidDate(dt) {
    return (dt >= (moment().startOf('day')))
      && (dt <= moment().add(30, 'days'));
  }

  get startTime() {
    const { now, date, tz } = this.state;
    const timeZoneLess = date.format('YYYY-MM-DD HH:mm');
    return now ? 'now' : momentTz.tz(timeZoneLess, tz).format().replace('Z', '+00:00');
  }

  handleSendConfirm(e) {
    e.preventDefault();
    const { listId } = this.state;
    this.setState({ listId: null });
    this.props.onCancel();
    const { dispatch, onConfirm } = this.props;
    const { startTime } = this;
    dispatch(sendLoaded(listId, startTime));
    onConfirm();
  }

  get sendDisabled() {
    return !this.state.listId && moment(this.state.date).isValid();
  }

  render() {
    const { show, onHide } = this.props;
    const { now, date, tz } = this.state;
    return (
      <Modal show={show} onHide={onHide}>
        <Form onSubmit={(e) => this.handleSendConfirm(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Send</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup controlId="recipientList">
              <Row>
                <Col xs={3}>
                  <ControlLabel>Send immediately</ControlLabel>
                  <div>
                    <Switch
                      state={now}
                      onChange={(_now) => this.handleSwitchToggle(_now)}
                    />
                  </div>
                </Col>
                {!now ? <Col xs={5}>
                  <ControlLabel>Date & Time</ControlLabel>
                  <DateTime
                    value={date}
                    dateFormat="D MMM YYYY"
                    isValidDate={this.isValidDate}
                    onChange={(_date) => this.handleDateTimeSelect(_date)}
                  />
                </Col> : null}
                {!now ? <Col xs={4}>
                  <ControlLabel>Timezone</ControlLabel>
                  <TimezonePicker
                    value={tz}
                    onSelect={(_tz) => this.handleTZSelect(_tz)}
                  />
                </Col> : null}
              </Row>
            </FormGroup>
            You can confirm the details on the next page prior to sending.
          </Modal.Body>
          <Modal.Footer>
            <Button key={'cancel'} onClick={() => this.props.onCancel()}>Cancel</Button>
            <Button
              type="submit"
              key={'confirm'}
              bsStyle="primary"
              disabled={this.sendDisabled}
            >
              Continue
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

@connect()
export default class ConnectedEmailSendDialog extends EmailSendDialog {}
