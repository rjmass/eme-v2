import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { SubstitutionItem } from 'components/Substitutions';
import { Link } from 'react-router';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import substitutions from 'test/fixtures/substitutions';
chai.use(chaiEnzyme());

const [substitution] = substitutions;

describe('<SubstitutionItem />', () => {
  it('renders a list group item', () => {
    expectComponentsToExist(<SubstitutionItem substitution={substitution} />, 'tr');
  });

  it('attaches the correct href', () => {
    const wrapper = shallow(<SubstitutionItem substitution={substitution} />);
    expect(wrapper.find(Link)).to.have.prop('to').equal(`/substitutions/${substitution._id}`);
  });

  it('prints the correct substitution name', () => {
    const wrapper = shallow(<SubstitutionItem substitution={substitution} />);
    expect(wrapper.find(Link)).to.contain(`${substitution.name}`);
  });
});
