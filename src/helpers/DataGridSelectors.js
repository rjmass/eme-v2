import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

export default function (filterRows, sortRows) {
  const getInputRows = state => state.rows;
  const getFilters = state => state.filters;
  const getFilteredRows = createSelector(
    [getFilters, getInputRows], (filters, rows) => {
      if (!filters || isEmpty(filters)) {
        return rows;
      }
      return filterRows(filters, rows);
    });

  const getSortColumn = state => state.sortColumn;
  const getSortDirection = state => state.sortDirection;
  const getSortedRows = createSelector(
    [getFilteredRows, getSortColumn, getSortDirection],
    (rows, sortColumn, sortDirection) => {
      if (!sortDirection && !sortColumn) {
        return rows;
      }
      return sortRows(rows, sortColumn, sortDirection);
    });

  return {
    getRows: getSortedRows
  };
}
