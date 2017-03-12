import React, { Component, PropTypes } from 'react';
import config from '../../config';
import Helmet from 'react-helmet';
import * as authActions from 'redux/modules/auth';
import { connect } from 'react-redux';
import './Home.scss';

@connect((state) => ({ user: state.auth.user, error: state.auth.loginError }), authActions)
export default class Home extends Component {

  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func
  }

  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    return (
      <div className="home">
        <Helmet title="Home" />
        <div className="masthead">
          <div className="container">
            <h1>{config.app.title}</h1>
            <h2>{config.app.description}</h2>
            <p className="humility">
              Brought to you by Andrew J and Mus
            </p>
          </div>
        </div>
      </div>
    );
  }
}
