import Keen from 'keen-analysis';

export function getKeenClient() {
  const queryType = 'select_unique';
  const client = new Keen();
  const { KEEN_PROJECT_ID, KEEN_READ_KEY } = process.env;

  return client
    .get(`https://api.keen.io/3.0/projects/${KEEN_PROJECT_ID}/queries/${queryType}`)
    .auth(KEEN_READ_KEY);
}

export function formatQuery(id, action, start, end) {
  const query = {
    event_collection: 'events',
    target_property: 'user.ft_guid',
    max_age: 1 * 60, // 1 minute of server-side caching, seconds,
    timezone: 'UTC',
    filters: [
      { operator: 'eq', property_name: 'context.product', property_value: 'MeMe' },
      { operator: 'eq', property_name: 'context.emailId', property_value: id },
      { operator: 'eq', property_name: 'action', property_value: action },
      { operator: 'exists', property_name: 'user.ft_guid', property_value: true },
    ],
    timeframe: {
      start,
      end
    }
  };

  return query;
}

