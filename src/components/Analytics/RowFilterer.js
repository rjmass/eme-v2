export default (filters, rows = []) => {
  return rows.filter(r => {
    let include = true;
    for (const columnKey of Object.keys(filters)) {
      const colFilter = filters[columnKey];
      // check if custom filter function exists
      if (colFilter.filterValues && typeof colFilter.filterValues === 'function') {
        include = include && colFilter.filterValues(r, colFilter, columnKey);
      } else if (typeof colFilter.filterTerm === 'string') {
        // default filter action
        const rowValue = r[columnKey].toString().toLowerCase();
        if (rowValue.indexOf(colFilter.filterTerm.toLowerCase()) === -1) {
          include = false;
        }
      }
    }
    return include;
  });
};
