import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { SubstitutionsList } from 'components/Substitutions';
import { SubstitutionsIndex } from 'components/Substitutions/SubstitutionsIndex';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import substitutions from 'test/fixtures/substitutions';
chai.use(chaiEnzyme());

describe('<SubstitutionsIndex />', () => {
  const substitutionsProp = { list: substitutions, filter: { name: '' } };
  const params = { page: 1 };

  it('contains: Link, Button, SubstitutionsList components', () => {
    expectComponentsToExist(
      <SubstitutionsIndex
        substitutions={substitutionsProp}
        params={params}
      />,
      Link, Button, SubstitutionsList);
  });

  it('passes correct props to Link', () => {
    const wrapper = shallow(
      <SubstitutionsIndex
        substitutions={substitutionsProp}
        params={params}
      />);
    expect(wrapper.find(Link)).to.have.prop('to').eql('/substitutions/new');
  });

  it('passes correct props to SubstitutionsList', () => {
    const wrapper = shallow(
      <SubstitutionsIndex
        substitutions={substitutionsProp}
        params={params}
      />);
    expect(wrapper.find(SubstitutionsList)).to.have.prop('list').eql(substitutions);
  });
});
