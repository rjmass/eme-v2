import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon/pkg/sinon';
import { shallow } from 'enzyme';
import { RichEditor, Editor } from 'components/Editor';
import { SnippetPicker } from 'components/Snippets';
import { NewsPicker } from 'components/NewsFeed';
import { expectComponentsToExist } from 'test/helpers/reactTestUtils';
chai.use(chaiEnzyme());
const sandbox = sinon.sandbox.create();

describe('<RichEditor />', () => {
  let onChangeSpy;

  beforeEach(() => {
    onChangeSpy = sandbox.spy();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('contains: Editor, SnippetPicker, NewsPicker', () => {
    expectComponentsToExist(<RichEditor onChange={onChangeSpy} />,
      Editor, SnippetPicker, NewsPicker);
  });

  it('passes correct props to Editor', () => {
    const wrapper = shallow(<RichEditor
      name={'test'}
      value={'testVal'}
      onChange={onChangeSpy}
    />);
    expect(wrapper.find(Editor)).to.have.prop('name').eql('test');
    expect(wrapper.find(Editor)).to.have.prop('value').eql('testVal');
    expect(wrapper.find(Editor)).to.have.prop('onChange').instanceOf(Function);
  });

  it('passes correct props to SnippetPicker', () => {
    const wrapper = shallow(<RichEditor
      html={false}
      onChange={onChangeSpy}
    />);
    expect(wrapper.find(SnippetPicker)).to.have.prop('html').eql(false);
    expect(wrapper.find(SnippetPicker)).to.have.prop('onSelect').instanceOf(Function);
  });

  it('passes correct props to NewsPicker', () => {
    const wrapper = shallow(<RichEditor
      onChange={onChangeSpy}
    />);
    expect(wrapper.find(NewsPicker)).to.have.prop('onInsert').instanceOf(Function);
  });

  it('passes correct props to NewsPicker', () => {
    const wrapper = shallow(<RichEditor
      onChange={onChangeSpy}
    />);
    const picket = wrapper.find(Editor);
    picket.props().onChange('');
    expect(onChangeSpy.callCount).to.eql(1);
    picket.props().onChange('test');
    expect(onChangeSpy.callCount).to.eql(2);
  });
});
