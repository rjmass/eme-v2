import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Helmet from 'react-helmet';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { push } from 'react-router-redux';
import config from '../../config';
import { asyncConnect } from 'redux-async-connect';
import { Notifs } from 'redux-notifications';
import Notification from './Notification';
import './App.scss';
import './notifications.css';
import './navbar.css';

export const menuItems = [
  { url: `${config.urlInfix}/templates`, title: 'Templates', key: 'templates' },
  { url: `${config.urlInfix}/emails`, title: 'Emails', key: 'emails' },
  { url: `${config.urlInfix}/snippets`, title: 'Snippets', key: 'snippets' },
  { url: `${config.urlInfix}/analytics`, title: 'Analytics', key: 'analytics' },
  { url: `${config.urlInfix}/campaigns`, title: 'Briefings', key: 'campaigns' },
  { url: `${config.urlInfix}/images`, title: 'Images', key: 'images' },
  { url: `${config.urlInfix}/users`, title: 'Users', key: 'users', admin: true },
];

export class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  getUserMenuItems() {
    const { user } = this.props;
    if (!user) return [];
    return menuItems.filter((mi) => {
      return (!mi.admin || (mi.admin && user.admin));
    });
  }

  handleLogout(event) {
    event.preventDefault();
    this.props.logout();
    this.props.pushState(`${config.urlInfix}/`);
  }

  checkRedirect() {
    const location = this.props.location || {};
    if (location.state && location.state.nextPathname) {
      this.props.pushState(location.state.nextPathname);
    }
  }

  render() {
    this.checkRedirect();
    const { user } = this.props;
    const userMenuItems = this.getUserMenuItems();

    return (
      <div className="app">
        <Notifs
          CustomComponent={Notification}
        />
        <Helmet {...config.app.head} />

        <Navbar fluid fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to={`${config.urlInfix}/`} activeStyle={{ color: '#33e0ff' }}>
                <div className="brand" />
                <span>{config.app.title}</span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse>

            <Nav navbar>
              {userMenuItems.map((menuItem) => {
                return (
                  <LinkContainer key={menuItem.key} to={menuItem.url}>
                    <NavItem>
                      {menuItem.title}
                    </NavItem>
                  </LinkContainer>
                );
              })}
            </Nav>

            <Nav pullRight>
              {user && <LinkContainer to={`${config.urlInfix}/account`}>
                <NavItem>
                  <strong>
                    <span className="glyphicon glyphicon-user" />
                    &nbsp; {user.name || user.username}
                  </strong>
                </NavItem>
              </LinkContainer>}

              {user &&
                <NavItem className="logout-link" onClick={(event) => this.handleLogout(event)}>
                  <span className="glyphicon glyphicon-log-out"></span>
                  &nbsp;Logout
                </NavItem>}

              {!user &&
                <NavItem className="login-link" href={`${config.urlInfix}/`}>
                  <span className="glyphicon glyphicon-log-in"></span>
                  &nbsp;Login
                </NavItem>}
            </Nav>

          </Navbar.Collapse>
        </Navbar>

        <div className="appContent">
          {this.props.children}
        </div>

      </div>
    );
  }
}

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    if (!isAuthLoaded(getState())) {
      return dispatch(loadAuth());
    }
    return Promise.all([]);
  }
}])
@connect((state) => ({ user: state.auth.user }), { logout, pushState: push })
export default class ConnectedApp extends App { }
