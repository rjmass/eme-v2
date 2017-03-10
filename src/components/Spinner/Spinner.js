import React, { PropTypes, Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import './Spinner.css';

export default class Spinner extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired
  }

  render() {
    return (
      <Row>
        <Col xs={12} className={this.props.isVisible ? 'centeredSpinner' : 'hidden'} >
          <div className="help-block" />
          <i className="fa fa-spinner fa-spin fa-2x text-center" />
          <strong>&nbsp;&nbsp;{this.props.text}</strong>
        </Col>
      </Row>
    );
  }

}

