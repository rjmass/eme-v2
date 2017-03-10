import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { LinkContainer } from 'react-router-bootstrap';
import { shallow } from 'enzyme';
import { App, menuItems } from 'containers/App/App';
chai.use(chaiEnzyme());

const regUser = { username: 'test' };
const adminUser = Object.assign({}, regUser, { admin: true });

const renderAppForUser = (user) => (
  <App
    children={<div>hello</div>}
    user={user}
    logout={() => { }}
    pushState={() => { }}
  />
);

describe('<App />', () => {
  it('contains: Links for All Non-Administrative routes', () => {
    const app = renderAppForUser(regUser);
    const wrapper = shallow(app, { context: { store: {} } });
    const links = wrapper.find(LinkContainer).map(link => link.props().to);
    menuItems
      .filter(mi => !mi.admin)
      .forEach(item => expect(links).to.contain(item.url));
  });

  it('contains: Links for All Administrative routes', () => {
    const app = renderAppForUser(adminUser);
    const wrapper = shallow(app, { context: { store: {} } });
    const links = wrapper.find(LinkContainer).map(link => link.props().to);
    menuItems
      .forEach(item => expect(links).to.contain(item.url));
  });
});
