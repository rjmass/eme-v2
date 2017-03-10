export default function sortRows(rows, sortColumn, dir) {
  let item1;
  let item2;
  function comparer(a, b) {
    switch (sortColumn) {
      case 'Name': {
        item1 = a.Name.props.email.name;
        item2 = b.Name.props.email.name;
        break;
      }
      case 'Campaign': {
        item1 = a.Campaign ? a.Campaign.props.campaign.name : '';
        item2 = b.Campaign ? b.Campaign.props.campaign.name : '';
        break;
      }
      case 'Sent Date': {
        item1 = a['Sent Date'].props.sortValue;
        item2 = b['Sent Date'].props.sortValue;
        break;
      }
      case 'CTR':
      case 'OR':
      case 'DR':
      case 'UR': {
        item1 = a[sortColumn].props.value;
        item2 = b[sortColumn].props.value;
        break;
      }
      default: {
        item1 = a[sortColumn];
        item2 = b[sortColumn];
      }
    }

    if (dir === 'ASC') {
      return (item1 > item2) ? 1 : -1;
    } else if (dir === 'DESC') {
      return (item1 < item2) ? 1 : -1;
    }
    return 0;
  }
  return dir === 'NONE' ? rows : rows.slice().sort(comparer);
}
