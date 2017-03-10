import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { EmailsList } from 'components/Emails';
import { EmailsIndex } from 'components/Emails/EmailsIndex';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
import emails from 'test/fixtures/emails';
chai.use(chaiEnzyme());

describe('<EmailsIndex />', () => {
  const emailsProp = { list: emails, filter: { name: '' } };
  const params = { page: 1 };

  it('contains: EmailsList components', () => {
    expectComponentsToExist(<EmailsIndex emails={emailsProp} params={params} />,
      EmailsList);
  });

  it('passes correct props to EmailsList', () => {
    const wrapper = shallow(<EmailsIndex emails={emailsProp} params={params} />);
    expect(wrapper.find(EmailsList)).to.have.prop('list').eql(emails);
  });
});
