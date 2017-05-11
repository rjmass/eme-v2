import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { Preview } from 'components/Preview';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import { Tabs, Tab } from 'react-bootstrap';
chai.use(chaiEnzyme());

describe('<Preview />', () => {
  const preview = <Preview substitutionEnabled={false} onTabSelect={() => {}} />;

  it('contains: Tabs component', () => {
    expectComponentsToExist(preview, Tabs);
  });

  it('contains a HTML tab', () => {
    const wrapper = shallow(preview);
    expect(wrapper.find(Tab).first()).to.have.prop('eventKey', 'html');
  });
});
