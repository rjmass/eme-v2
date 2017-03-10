import React from 'react';
import { SubstitutionsList } from 'components/Substitutions';
import { Pagination } from 'react-bootstrap';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import substitutions from 'test/fixtures/substitutions';

describe('<SubstitutionsList />', () => {
  it('contains Pagination, List Group components', () => {
    expectComponentsToExist(<SubstitutionsList
      list={substitutions}
      totalCount={5}
      page={1}
      perPage={1}
      filter={{ name: '' }}
      onFilter={() => { }}
    />,
      Pagination);
  });
});
