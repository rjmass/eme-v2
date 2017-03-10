import { Filters } from 'react-data-grid/addons';
import { NO_CAMPAIGN } from './analyticsConst';
import isEmpty from 'lodash/isEmpty';

export default class AnalyticsCampaignColumnFilter extends Filters.AutoCompleteFilter {

  filterValues(row, columnFilter, columnKey) {
    let include = true;
    if (columnFilter === null) {
      include = false;
    } else if (!isEmpty(columnFilter.filterTerm)) {
      for (const term of columnFilter.filterTerm) {
        const campaign = row[columnKey].props ?
          row[columnKey].props.campaign.name :
          NO_CAMPAIGN;
        const lookupIndex = campaign.trim().toLowerCase().indexOf(term.value.trim().toLowerCase());
        if (lookupIndex === -1 || (lookupIndex === 0 && campaign !== term.value)) {
          include = false;
        } else {
          include = true;
          break;
        }
      }
    }
    return include;
  }
}

