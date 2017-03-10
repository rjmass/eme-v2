import React from 'react';
import { BaseList } from 'components/Base';
import snippets from 'test/fixtures/snippets';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';

describe('<BaseList />', () => {
  it('renders headers when given', () => {
    class TestBaseList extends BaseList {
      get headers() {
        return ['Name'];
      }
    }
    expectComponentsToExist(<TestBaseList
      list={snippets}
      totalCount={5}
      page={1}
      renderItem={() => {}}
      perPage={1}
      filter={{ name: '' }}
      onFilter={() => { }}
    />, 'tr', 'th');
  });

  it('does not render header if no headers are given', () => {
    class TestBaseList extends BaseList { }
    const wrapper = shallow(<TestBaseList
      list={snippets}
      totalCount={5}
      page={1}
      renderItem={() => {}}
      perPage={1}
      filter={{ name: '' }}
      onFilter={() => { }}
    />);
    expect(wrapper.find('th')).to.not.exist;
  });
});
