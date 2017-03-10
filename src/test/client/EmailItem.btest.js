import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { EmailItem } from 'components/Emails';
import { Link } from 'react-router';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import email from 'test/fixtures/email';
chai.use(chaiEnzyme());

describe('<EmailItem />', () => {
  it('renders a list group item', () => {
    expectComponentsToExist(<EmailItem email={email} />, 'tr');
  });

  it('attaches the correct href', () => {
    const wrapper = shallow(<EmailItem email={email} />);
    expect(wrapper.find(Link)).to.have.prop('to').equal(`/emails/${email._id}`);
  });

  it('prints the correct email name', () => {
    const wrapper = shallow(<EmailItem email={email} />);
    expect(wrapper.find(Link)).to.contain(email.name);
  });
});
