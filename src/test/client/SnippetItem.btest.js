import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { SnippetItem } from 'components/Snippets';
import { Link } from 'react-router';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import snippet from 'test/fixtures/snippet';
chai.use(chaiEnzyme());

describe('<SnippetItem />', () => {
  it('renders a list group item', () => {
    expectComponentsToExist(<SnippetItem snippet={snippet} />, 'tr');
  });

  it('attaches the correct href', () => {
    const wrapper = shallow(<SnippetItem snippet={snippet} />);
    expect(wrapper.find(Link)).to.have.prop('to').equal(`/snippets/${snippet._id}`);
  });

  it('prints the correct snippet name', () => {
    const wrapper = shallow(<SnippetItem snippet={snippet} />);
    expect(wrapper.find(Link)).to.contain(` ${snippet.name}`);
  });
});
