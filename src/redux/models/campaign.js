import { Schema, arrayOf } from 'normalizr';

const campaignSchema = new Schema('campaigns', {
  idAttribute: campaign => campaign._id
});

const Schemas = {
  CAMPAIGN: campaignSchema,
  CAMPAIGN_ARRAY: arrayOf(campaignSchema)
};

export default Schemas;
