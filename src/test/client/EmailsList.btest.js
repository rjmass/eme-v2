import React from 'react';
import { EmailsList } from 'components/Emails';
import { Pagination } from 'react-bootstrap';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import emails from 'test/fixtures/emails';

describe('<EmailsList />', () => {
  it('contains Pagination, List Group components', () => {
    expectComponentsToExist(<EmailsList
      list={emails}
      totalCount={5}
      page={1}
      perPage={1}
      checkedBoxes={{ }}
      handleChecked={() => { }}
      filter={{ name: '' }}
      onFilter={() => { }}
    />,
      Pagination);
  });
});
