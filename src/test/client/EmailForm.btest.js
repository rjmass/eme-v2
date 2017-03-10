import React from 'react';
import { shallow } from 'enzyme';
import { EmailFieldForm } from 'components/Emails/EmailForm';
import email from 'test/fixtures/email';

describe('<EmailForm />', () => {
  it('renders a form', () => {
    shallow(<EmailFieldForm
      activeFieldTab={'email-properties'}
      activeContentTab={'html'}
      onContentTabSelect={() => { }}
      onFieldTabSelect={() => { }}
      email={email}
      onSubmit={() => { }}
      onPlainChange={() => { }}
    />
    );
  });
});
