export default function (key, dir) {
  return function (a, b) {
    let item1;
    let item2;
    switch (key.toLowerCase()) {
      case 'campaign': {
        item1 = a.campaignDetails ? a.campaignDetails.name : '';
        item2 = b.campaignDetails ? b.campaignDetails.name : '';
        break;
      }
      case 'updated': {
        item1 = a.updatedAt || '';
        item2 = b.updatedAt || '';
        break;
      }
      case 'name': {
        item1 = a.name || '';
        item2 = b.name || '';
        break;
      }
      case 'subject': {
        item1 = a.subject || '';
        item2 = b.subject || '';
        break;
      }
      case 'active': {
        item1 = (a.archived && a.archived.toString()) || '';
        item2 = (b.archived && b.archived.toString()) || '';
        break;
      }
      default: {
        const [key1] = Object.keys(a);
        const [key2] = Object.keys(b);

        item1 = a[key1] || '';
        item2 = b[key2] || '';
      }
    }

    if (dir === 'ASC') {
      return (item1).localeCompare(item2, undefined, { numeric: true });
    }
    return (item2).localeCompare(item1, undefined, { numeric: true });
  };
}
