import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { Message } from 'components/Message';
chai.use(chaiEnzyme());

before(() => {
  console.error = error => {
    throw new Error(error);
  };
});

describe('<Message />', () => {
  it('renders a proper error message', () => {
    const message = 'Some Error';
    const error = new Error(message);
    const wrapper = shallow(<Message text={error.message} type="danger" />);
    expect(wrapper.find('Alert')).to.contain(message);
  });
});
