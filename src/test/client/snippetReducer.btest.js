import { expect } from 'chai';
import reducer, * as actions from 'redux/modules/snippets';
import snippet from 'test/fixtures/snippet';
import snippetsNormalized from 'test/fixtures/snippetsNormalized';

const initialState = actions.initialState;

describe('Snippet reducer', () => {
  it('returns an initial state', () => {
    expect(reducer(undefined, {})).to.eql(initialState);
  });

  it('handles SNIPPETS_LOAD', () => {
    const expectedState = { ...initialState, listLoading: true };
    expect(reducer(initialState, { type: actions.SNIPPETS_LOAD })).to.eql(expectedState);
  });

  it('handles SNIPPETS_LOADED', () => {
    const expectedState = {
      ...initialState,
      list: snippetsNormalized,
      error: null,
      listLoading: false
    };

    const state = reducer(initialState, {
      type: actions.SNIPPETS_LOADED,
      snippets: snippetsNormalized
    });
    state.updated = 0;
    expect(state).to.eql(expectedState);
  });

  it('handles SNIPPETS_FILTER', () => {
    const filter = { name: 'example' };
    const expectedState = { ...initialState, filter };
    expect(
      reducer(initialState, { type: actions.SNIPPETS_FILTER, filter })
    ).to.eql(expectedState);
  });

  it('handles SNIPPET_LOAD', () => {
    const expectedState = { ...initialState, snippetLoading: true };
    expect(reducer(initialState, { type: actions.SNIPPET_LOAD })).to.eql(expectedState);
  });

  it('handles SNIPPET_LOADED', () => {
    const expectedState = {
      ...initialState,
      list: { ...initialState.list, [snippet._id]: snippet },
      error: null,
      snippetLoading: false
    };
    expect(
      reducer(initialState, { type: actions.SNIPPET_LOADED, snippet })
    ).to.eql(expectedState);
  });

  it('handles SNIPPET_VALIDATION_ERROR', () => {
    const error = { message: 'problem' };
    const expectedState = { ...initialState, error };
    expect(
      reducer(initialState, { type: actions.SNIPPET_VALIDATION_ERROR, error })
    ).to.eql(expectedState);
  });

  it('handles SNIPPET_SERVER_ERROR', () => {
    const error = { message: 'problem' };
    const expectedState = { ...initialState, error };
    expect(
      reducer(initialState, { type: actions.SNIPPET_SERVER_ERROR, error })
    ).to.eql(expectedState);
  });
});
