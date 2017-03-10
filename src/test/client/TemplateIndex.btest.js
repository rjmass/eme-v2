import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { TemplatesList } from 'components/Templates';
import { TemplatesIndex } from 'components/Templates/TemplatesIndex';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import templates from 'test/fixtures/templates';
chai.use(chaiEnzyme());

describe('<TemplatesIndex />', () => {
  const templatesProp = { list: templates, filter: { name: '' } };
  const params = { page: 1 };

  it('contains: Link, Button, TemplatesList components', () => {
    expectComponentsToExist(<TemplatesIndex templates={templatesProp} params={params} />,
      Link, Button, TemplatesList);
  });

  it('passes correct props to Link', () => {
    const wrapper = shallow(<TemplatesIndex templates={templatesProp} params={params} />);
    expect(wrapper.find(Link)).to.have.prop('to').eql('/templates/new');
  });

  it('passes correct props to TemplatesList', () => {
    const wrapper = shallow(<TemplatesIndex templates={templatesProp} params={params} />);
    expect(wrapper.find(TemplatesList)).to.have.prop('list').eql(templates);
  });
});
