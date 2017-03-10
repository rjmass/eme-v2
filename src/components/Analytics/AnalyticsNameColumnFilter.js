import { Filters } from 'react-data-grid/addons';
import isEmpty from 'lodash/isEmpty';

export default class AnalyticsNameColumnFilter extends Filters.AutoCompleteFilter {

  filterValues(row, columnFilter, columnKey) {
    let include = true;
    if (columnFilter === null) {
      include = false;
    } else if (!isEmpty(columnFilter.filterTerm)) {
      for (const term of columnFilter.filterTerm) {
        const name = row[columnKey].props.email.name;
        const lookupIndex = name.trim().toLowerCase().indexOf(term.value.trim().toLowerCase());
        if (lookupIndex === -1 || (lookupIndex === 0 && name !== term.value)) {
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
