import AnalyticsNameColumnFilter from './AnalyticsNameColumnFilter';
import AnalyticsCampaignColumnFilter from './AnalyticsCampaignColumnFilter';
import AnalyticsNumberFilter from './AnalyticsNumberFilter';
import AnalyticsDateFilter from './AnalyticsDateFilter';

module.exports = [
  {
    key: 'Name',
    name: 'Name',
    resizable: true,
    filterable: true,
    sortable: true,
    filterRenderer: AnalyticsNameColumnFilter,
    width: 280,
  },
  {
    key: 'Sent Date',
    name: 'Sent Date',
    filterable: true,
    filterRenderer: AnalyticsDateFilter,
    width: 235,
    sortable: true,
    resizable: true
  },
  {
    key: 'Campaign',
    name: 'Campaign',
    resizable: true,
    filterable: true,
    filterRenderer: AnalyticsCampaignColumnFilter,
    width: 140,
    sortable: true,
  },
  {
    key: 'Sent',
    name: 'Sent',
    filterable: true,
    filterRenderer: AnalyticsNumberFilter,
    sortable: true,
    width: 120,
    resizable: true
  },
  {
    key: 'Delivered',
    name: 'Delivered',
    filterable: true,
    filterRenderer: AnalyticsNumberFilter,
    width: 120,
    sortable: true,
    resizable: true
  },
  {
    key: 'DR',
    name: 'DR',
    filterable: true,
    filterRenderer: AnalyticsNumberFilter,
    width: 120,
    sortable: true,
    resizable: true
  },
  {
    key: 'Open',
    name: 'Open',
    width: 120,
    filterable: true,
    filterRenderer: AnalyticsNumberFilter,
    sortable: true,
    resizable: true
  },
  {
    key: 'Unique Open',
    name: 'Unique Open',
    width: 120,
    filterable: true,
    filterRenderer: AnalyticsNumberFilter,
    sortable: true,
    resizable: true
  },
  {
    key: 'OR',
    name: 'OR',
    filterable: true,
    width: 120,
    filterRenderer: AnalyticsNumberFilter,
    sortable: true,
    resizable: true
  },
  {
    key: 'Click',
    name: 'Click',
    filterable: true,
    filterRenderer: AnalyticsNumberFilter,
    width: 120,
    sortable: true,
    resizable: true
  },
  {
    key: 'Unique Click',
    name: 'Unique Click',
    width: 120,
    filterable: true,
    filterRenderer: AnalyticsNumberFilter,
    sortable: true,
    resizable: true
  },
  {
    key: 'CTR',
    name: 'CTR',
    width: 120,
    filterable: true,
    filterRenderer: AnalyticsNumberFilter,
    sortable: true,
    resizable: true
  },
  {
    key: 'Bounce',
    name: 'Bounce',
    filterable: true,
    filterRenderer: AnalyticsNumberFilter,
    width: 120,
    sortable: true,
    resizable: true
  },
  {
    key: 'Spam',
    name: 'Spam',
    width: 120,
    filterable: true,
    filterRenderer: AnalyticsNumberFilter,
    sortable: true,
    resizable: true
  },
  {
    key: 'Unique Unsubscribe',
    name: 'Unique Unsub',
    filterable: true,
    filterRenderer: AnalyticsNumberFilter,
    width: 120,
    sortable: true,
    resizable: true
  },
  {
    key: 'UR',
    name: 'UR',
    filterable: true,
    filterRenderer: AnalyticsNumberFilter,
    width: 120,
    sortable: true,
    resizable: true
  }
];
