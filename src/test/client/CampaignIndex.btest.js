import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { CampaignsList } from 'components/Campaigns';
import { CampaignsIndex } from 'components/Campaigns/CampaignsIndex';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import campaigns from 'test/fixtures/campaigns';
chai.use(chaiEnzyme());

describe('<CampaignsIndex />', () => {
  const campaignsProp = { list: campaigns, filter: { name: '' } };
  const params = { page: 1 };

  it('contains: Link, Button, CampaignsList components', () => {
    expectComponentsToExist(
      <CampaignsIndex
        campaigns={campaignsProp}
        params={params}
      />,
      Link, Button, CampaignsList);
  });

  it('passes correct props to Link', () => {
    const wrapper = shallow(
      <CampaignsIndex
        campaigns={campaignsProp}
        params={params}
      />);
    expect(wrapper.find(Link)).to.have.prop('to').eql('/campaigns/new');
  });

  it('passes correct props to CampaignsList', () => {
    const wrapper = shallow(
      <CampaignsIndex
        campaigns={campaignsProp}
        params={params}
      />);
    expect(wrapper.find(CampaignsList)).to.have.prop('list').eql(campaigns);
  });
});
