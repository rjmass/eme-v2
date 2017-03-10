import React from 'react';
import { Capi } from 'components/Queries';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import { Button, Checkbox, FormGroup, FormControl } from 'react-bootstrap';

describe('<Capi />', () => {
  const fields = {
    value: {
      activated: false,
      list: [{ type: 'CAPI', query: 'test', variableName: 'test', limit: '1Day' }]
    }
  };

  it('contains: Form components', () => {
    expectComponentsToExist(
      <Capi
        fields={fields}
        onQueryChange={() => { }}
        onQueryAdd={() => { }}
        onQueryActivate={() => { }}
        onQueryRemove={() => { }}
      />,
      Checkbox, FormControl, FormGroup, Button);
  });
});
