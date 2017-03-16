import React from 'react';
import { TemplatesList } from 'components/Templates/TemplatesList';
import { Pagination } from 'react-bootstrap';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import templates from 'test/fixtures/templates';

describe('<TemplatesList />', () => {
  it('contains Pagination, List Group components', () => {
    expectComponentsToExist(<TemplatesList
      list={templates}
      totalCount={5}
      page={1}
      perPage={1}
      filter={{ name: '' }}
      onFilter={() => { }}
    />,
      Pagination);
  });
});
