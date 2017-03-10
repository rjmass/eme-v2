import React from 'react';
import { CampaignsList } from 'components/Campaigns';
import { Pagination } from 'react-bootstrap';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import campaigns from 'test/fixtures/campaigns';

describe('<CampaignsList />', () => {
  it('contains Pagination, List Group components', () => {
    expectComponentsToExist(<CampaignsList
      list={campaigns}
      totalCount={5}
      page={1}
      perPage={1}
      filter={{ name: '' }}
      onFilter={() => { }}
    />,
      Pagination);
  });
});
