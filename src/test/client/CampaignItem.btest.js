import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { CampaignItem } from 'components/Campaigns';
import { Link } from 'react-router';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import campaigns from 'test/fixtures/campaigns';
chai.use(chaiEnzyme());

const [activeCampaign, , archivedCampaign] = campaigns;

describe('<CampaignItem />', () => {
  it('attaches the correct href', () => {
    const wrapper = shallow(<CampaignItem campaign={activeCampaign} />);
    expect(wrapper.find(Link)).to.have.prop('to').equal(`/campaigns/${activeCampaign._id}`);
  });

  it('prints the correct campaign name', () => {
    const wrapper = shallow(<CampaignItem campaign={activeCampaign} />);
    expect(wrapper.find(Link)).to.contain(`${activeCampaign.name}`);
  });

  it('renders a list group item', () => {
    expectComponentsToExist(<CampaignItem campaign={activeCampaign} />, 'tr');
  });

  it('displays a tick for active campaigns', () => {
    const wrapper = shallow(<CampaignItem campaign={activeCampaign} />, 'td');
    expect(wrapper.find('.fa.fa-check')).to.have.length(1);
  });

  it('does not display a tick for archived campaigns', () => {
    const wrapper = shallow(<CampaignItem campaign={archivedCampaign} />, 'td');
    expect(wrapper.find('.fa.fa-check')).to.have.length(0);
  });
});
