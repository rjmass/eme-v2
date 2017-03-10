import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
chai.use(chaiEnzyme());

export function expectComponentsToExist(parentComponent, ...childComponents) {
  const wrapper = shallow(parentComponent);
  childComponents.map((component) => {
    try {
      return expect(wrapper.find(component)).to.exist;
    } catch (error) {
      throw error;
    }
  });
}
