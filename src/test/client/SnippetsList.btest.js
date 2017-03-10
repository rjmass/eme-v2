import React from 'react';
import { SnippetsList } from 'components/Snippets';
import { Pagination } from 'react-bootstrap';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import snippets from 'test/fixtures/snippets';

describe('<SnippetsList />', () => {
  it('contains Pagination, List Group components', () => {
    expectComponentsToExist(<SnippetsList
      list={snippets}
      totalCount={5}
      page={1}
      perPage={1}
      filter={{ name: '' }}
      onFilter={() => { }}
    />,
      Pagination);
  });
});
