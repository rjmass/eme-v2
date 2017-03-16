import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { Card as TemplateDragCard } from 'components/Templates/TemplateDragCard';
chai.use(chaiEnzyme());

describe('<TemplateDragCard />', () => {
  it('renders a card', () => {
    const wrapper = shallow(<TemplateDragCard
      connectDragSource={() => <div className="test"></div>}
      connectDropTarget={() => <div className="test"></div>}
      onSnippetSelect={() => { }}
      moveCard={() => { }}
      index={1}
      isDragging
      _id="1234"
      name="test"
    />);
    console.log(wrapper.debug());
    expect(wrapper.find('div').hasClass('test')).to.be.true;
  });
});
