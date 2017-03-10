import { expect } from 'chai';
import reducer, * as actions from 'redux/modules/templates';
import template from 'test/fixtures/template';
import templates from 'test/fixtures/templates';
import templatesNormalized from 'test/fixtures/templatesNormalized';

const initialState = actions.initialState;

describe('Template reducer', () => {
  it('returns an initial state', () => {
    expect(reducer(undefined, {})).to.eql(initialState);
  });

  it('handles TEMPLATES_LOAD', () => {
    const expectedState = { ...initialState, listLoading: true };
    expect(reducer(initialState, { type: actions.TEMPLATES_LOAD })).to.eql(expectedState);
  });

  it('handles TEMPLATES_LOADED', () => {
    const expectedState = { ...initialState, list: templates, error: null, listLoading: false };
    expect(
      reducer(initialState, { type: actions.TEMPLATES_LOADED, templates })
    ).to.eql(expectedState);
  });

  it('handles TEMPLATES_FILTER', () => {
    const filter = { name: 'example' };
    const expectedState = { ...initialState, filter };
    expect(
      reducer(initialState, { type: actions.TEMPLATES_FILTER, filter })
    ).to.eql(expectedState);
  });

  it('handles TEMPLATE_LOAD', () => {
    const expectedState = { ...initialState, templateLoading: true };
    expect(reducer(initialState, { type: actions.TEMPLATE_LOAD })).to.eql(expectedState);
  });

  it('handles TEMPLATE_LOADED', () => {
    const expectedState = {
      ...initialState,
      list: { ...initialState.list, [template._id]: template },
      error: null,
      templateLoading: false
    };
    expect(
      reducer(initialState, { type: actions.TEMPLATE_LOADED, template })
    ).to.eql(expectedState);
  });

  it('handles TEMPLATE_DELETED', () => {
    const id = templates[0]._id;
    const startingState = reducer(initialState,
      { type: actions.TEMPLATES_LOADED, templates: templatesNormalized });
    const deletedState = reducer(startingState,
      { type: actions.TEMPLATE_DELETED, id });
    expect(Object.keys(startingState.list).length).to.eql(2);
    expect(Object.keys(deletedState.list).length).to.eql(1);
    expect(deletedState.list[id]).to.not.exist;
  });

  it('handles TEMPLATE_VALIDATION_ERROR', () => {
    const error = { message: 'problem' };
    const expectedState = { ...initialState, error };
    expect(
      reducer(initialState, { type: actions.TEMPLATE_VALIDATION_ERROR, error })
    ).to.eql(expectedState);
  });

  it('handles TEMPLATE_SERVER_ERROR', () => {
    const error = { message: 'problem' };
    const expectedState = { ...initialState, error };
    expect(
      reducer(initialState, { type: actions.TEMPLATE_SERVER_ERROR, error })
    ).to.eql(expectedState);
  });
});
