import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { DropTarget } from 'react-dnd';
import { TemplateDragContainer } from 'components/Templates';
import { Button } from 'react-bootstrap';
chai.use(chaiEnzyme());

describe('<TemplateDragContainer />', () => {
  const identity = (el) => el;

  it('renders an Add button', () => {
    const OriginalContainer = TemplateDragContainer.DecoratedComponent;
    const wrapper = shallow(<OriginalContainer
      htmlString={'<body><div className="email-body"></div></body>'}
      connectDragSource={identity}
      onChange={() => { }}
    />);
    expect(wrapper.find(Button)).to.exist;
  });

  it.skip('renders a list of components if present on template', () => {
    const cards = [{ _id: '1', snippet: {} }];
    const OriginalContainer = TemplateDragContainer.DecoratedComponent;
    const wrapper = shallow(<OriginalContainer
      htmlString={'<body><div className="email-body"></div></body>'}
      connectDragSource={identity}
      cards={cards}
      onChange={() => { }}
    />);
    expect(wrapper.find(DropTarget)).to.not.exist;
  });
});
