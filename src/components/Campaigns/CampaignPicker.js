import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getCampaigns, campaignsLoadThunk } from 'redux/modules/campaigns';

@connect((state) => ({ list: getCampaigns(state.campaigns, true) }))
class CampaignPicker extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(campaignsLoadThunk());
  }

  render() {
    const { onSelect, list, value } = this.props;
    const options = list
      .map((campaign) => ({
        label: campaign.name,
        value: campaign._id
      }));

    const active = !value || options.find(o => o.value === value);
    const placeholder = active ?
      `Select a briefing.. (${options.length})` :
      'Inactive briefing';

    return (
      <Select
        name="campaign-picker"
        placeholder={placeholder}
        value={value}
        options={options}
        onChange={(option) => onSelect(option && option.value)}
        autosize={false}
      />
    );
  }
}

export default CampaignPicker;
