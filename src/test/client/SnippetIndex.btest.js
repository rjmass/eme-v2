import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { SnippetsList } from 'components/Snippets';
import { SnippetsIndex } from 'components/Snippets/SnippetsIndex';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import snippets from 'test/fixtures/snippets';
chai.use(chaiEnzyme());

describe('<SnippetsIndex />', () => {
  const snippetsProp = { list: snippets, filter: { name: '' } };
  const params = { page: 1 };

  it('contains: Link, Button, SnippetsList components', () => {
    expectComponentsToExist(<SnippetsIndex snippets={snippetsProp} params={params} />,
      Link, Button, SnippetsList);
  });

  it('passes correct props to Link', () => {
    const wrapper = shallow(<SnippetsIndex snippets={snippetsProp} params={params} />);
    expect(wrapper.find(Link)).to.have.prop('to').eql('/snippets/new');
  });

  it('passes correct props to SnippetsList', () => {
    const wrapper = shallow(<SnippetsIndex snippets={snippetsProp} params={params} />);
    expect(wrapper.find(SnippetsList)).to.have.prop('list').eql(snippets);
  });
});
