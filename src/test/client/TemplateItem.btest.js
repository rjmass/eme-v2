import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { TemplateItem } from 'components/Templates';
import { Link } from 'react-router';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import template from 'test/fixtures/template';
chai.use(chaiEnzyme());

describe('<TemplateItem />', () => {
  it('renders a list group item', () => {
    expectComponentsToExist(<TemplateItem template={template} />);
  });

  it('attaches the correct href', () => {
    const wrapper = shallow(<TemplateItem template={template} />);
    expect(wrapper.find(Link)).to.have.prop('to').equal(`/templates/${template._id}`);
  });

  it('prints the correct template name', () => {
    const wrapper = shallow(<TemplateItem template={template} />);
    expect(wrapper.find(Link)).to.contain(` ${template.name}`);
  });
});
